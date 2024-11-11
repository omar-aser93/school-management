import { auth } from "@clerk/nextjs/server";
import prisma from "../prisma";            //manually created file to connect to the DB
import { Prisma } from "@prisma/client";   //getting Typescript types from the prisma schema for (query & filters)


// getAnnouncements function, to fetch filtered announcements data (2 types: general announcements , class announcements)
export const getAnnouncements = async ( query: any, currentPage: number, Items_Per_Page: number) => {
  try {
    //we check received query value, as we need to get (search by announcement_title list) we get query directly from the search input
    const q: Prisma.AnnouncementWhereInput = {}; //object to store the query value after conditional test, Typescript type from "@prisma/client"
    for (const [key, value] of Object.entries(query)) {
      //to check keys of an object, using (for...of statement)
      switch (key) {
        case "search":
          q.title = { contains: query.search, mode: "insensitive" };
          break;
        default:
          break;
      }
    }

    // ROLE CONDITIONS (which data current user allowed to get depending on his role)
    const { userId, sessionClaims } = auth();         //clerk auth() hook to get current session_user data
    const role = (sessionClaims?.metadata as { role?: string })?.role;    //get user role from the session metadata
    switch (role) {
      case "admin":                         //admin gets (general announcements & all classes announcements)
        break;
      case "teacher":                       //teacher gets both (general announcements {classId: null} & his class announcements) 
        q.OR = [
          { classId: null },
          { class: { lessons: { some: { teacherId: userId! } } } },
        ];                
        break;
      case "student":                       //student gets both (general announcements {classId: null} & his class announcements)
        q.OR = [
          { classId: null },
          { class: { students: { some: { id: userId! } } } },
        ]; 
        break;
      case "parent":                       //parent gets both (general announcements {classId: null} & his children class announcements)
        q.OR = [
          { classId: null },
          { class: { students: { some: { parentId: userId! } } } },
        ]; 
        break;
      default:
        break;
    }

    //get announcements using prisma.findMany(), inclue the actual data of related model (class), also pass filter Queries & pagination needed data
    const announcementsData = await prisma.announcement.findMany({
      where: q,
      include: { class: true },
      take: Items_Per_Page,
      skip: Items_Per_Page * (currentPage - 1),
    });
    const count = await prisma.announcement.count({ where: q }); //get filtered announcements count, we use it to get the numberOfPages
    return {announcementsData, numberOfPages: Math.ceil(count / Items_Per_Page) }; //return filtered announcements data & (number of pages) that will be used in Pagination
  } catch (err) {
    console.log(err);    
  }
};




//getHomeAnnouncements function, to fetch last 3 announcements for the home page
export const getHomeAnnouncements = async () => {
  try {    
    const q: Prisma.AnnouncementWhereInput = {};   //object to store the query value, Typescript type from "@prisma/client"
    
    // ROLE CONDITIONS (which data current user allowed to get depending on his role)
    const { userId, sessionClaims } = auth();         //clerk auth() hook to get current session_user data
    const role = (sessionClaims?.metadata as { role?: string })?.role;    //get user role from the session metadata
    switch (role) {
      case "admin":                         //admin gets (general announcements & all classes announcements)
        break;
      case "teacher":                       //teacher gets both (general announcements {classId: null} & his class announcements) 
        q.OR = [
          { classId: null },
          { class: { lessons: { some: { teacherId: userId! } } } },
        ];                
        break;
      case "student":                       //student gets both (general announcements {classId: null} & his class announcements)
        q.OR = [
          { classId: null },
          { class: { students: { some: { id: userId! } } } },
        ]; 
        break;
      case "parent":                       //parent gets both (general announcements {classId: null} & his children class announcements)
        q.OR = [
          { classId: null },
          { class: { students: { some: { parentId: userId! } } } },
        ]; 
        break;
      default:
        break;
    }

    //get announcements using prisma.findMany(), sort by "desc" take & take 3 items
    const data = await prisma.announcement.findMany({ take: 3, orderBy: { date: "desc" }, where: q });
    
    return (data) ;        //return 3 announcements data for the homepage announcments component 
  } catch (err) {
    console.log(err);    
  }
};