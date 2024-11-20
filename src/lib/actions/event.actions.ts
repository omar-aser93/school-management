import { auth } from "@clerk/nextjs/server";
import prisma from "../prisma";            //manually created file to connect to the DB
import { Prisma } from "@prisma/client";   //getting Typescript types from the prisma schema for (query & filters)


// getEvents function, to fetch filtered events data (2 types: general events , class events)
export const getEvents = async (query: any, currentPage: number, Items_Per_Page: number, sort: any) => {
  try {

    //we check received query value, as we need to get (search by event_title list) we get query directly from the search input   
    const q: Prisma.EventWhereInput = {};      //object to store the query value after conditional test, Typescript type from "@prisma/client"
    for (const [key, value] of Object.entries(query)) {    //to check keys of an object, using (for...of statement)
      switch (key) {
        case "search":
          q.title = { contains: query.search, mode: "insensitive" };
          break;
        default:
          break;
      }
    }

    // ROLE CONDITIONS (which data current user allowed to get depending on his role)       
    const { userId, sessionClaims } = auth();             //clerk auth() hook to get current session_user data 
    const role = (sessionClaims?.metadata as { role?: string })?.role;    //get user role from the session metadata
    switch (role) {
      case "admin":                            //admin gets (general events & all classes events)
        break;
      case "teacher":                          //teacher gets both (general events {classId: null} & his class events) 
        q.OR = [
          { classId: null },
          { class: { lessons: { some: { teacherId: userId! } } } },
        ];                
        break;
      case "student":                          //student gets both (general events {classId: null} & his class events)
        q.OR = [
          { classId: null },
          { class: { students: { some: { id: userId! } } } },
        ]; 
        break;
      case "parent":                          //parent gets both (general events {classId: null} & his children class events)
        q.OR = [
          { classId: null },
          { class: { students: { some: { parentId: userId! } } } },
        ]; 
        break;
      default:
        break;
    }               

    //get events using prisma.findMany(), inclue the actual data of related model (class), also pass filter Queries & pagination needed data
    const eventsData = await prisma.event.findMany({
      where: q,
      include: { class: true },
      take: Items_Per_Page,
      skip: Items_Per_Page * (currentPage - 1),
      orderBy: { title: sort },
    });
    const count = await prisma.event.count({ where: q });     //get filtered events count, we use it to get the numberOfPages
    return { eventsData, numberOfPages: Math.ceil(count / Items_Per_Page)};    //return filtered events data & (number of pages) that will be used in Pagination
  } catch (err) {
    console.log(err);
    //return { success: false, error: true };
  }
};
