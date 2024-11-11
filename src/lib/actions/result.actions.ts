import { auth } from "@clerk/nextjs/server";
import prisma from "../prisma";             //manually created file to connect to the DB
import { Prisma } from "@prisma/client";    //getting Typescript types from the prisma schema for (query & filters)


// getResults function, to fetch filtered results data
export const getResults = async ( query: any, currentPage: number, Items_Per_Page: number) => {
  try {
    /*we check query value, as we need to get either 1 of 2 filtered lists: 1st list (search by exam/student list) we get query directly from the search input   
      2nd list (results of specific student list) using the relation between result model & student model*/
    
    const q: Prisma.ResultWhereInput = {};          //object to store the query value after conditional test, Typescript type from "@prisma/client"
    for (const [key, value] of Object.entries(query)) {    //to check keys of an object, using (for...of statement)
      switch (key) {
        case "studentId":
          q.studentId = query.studentId;
          break;
        case "search":            //showing how we can search more than one column_values
          q.OR = [             
            { exam: { title: { contains: query.search, mode: "insensitive" } } },
            { student: { name: { contains: query.search, mode: "insensitive" } } },
          ];
          break;
        default:
          break;
      }
    }

    
    // ROLE CONDITIONS (which data current user allowed to get depending on his role)       
    const { userId, sessionClaims } = auth();             //clerk auth() hook to get current session_user data 
    const role = (sessionClaims?.metadata as { role?: string })?.role;    //get user role from the session metadata
    switch (role) {
      case "admin":                                 //admin gets all the data
        break;
      case "teacher":                               //teacher gets both his exams/assignments lesson results
        q.OR = [
          { exam: { lesson: { teacherId: userId! } } },
          { assignment: { lesson: { teacherId: userId! } } },
        ];                  
        break;
      case "student":                               //student gets only his results by his id
        q.studentId = userId!;
        break; 
      case "parent":                                //parent gets only his children results
        q.student = {
          parentId: userId!,
        };
        break;
      default:
        break;
    }

    //get results using prisma.findMany(), inclue the actual data of related models (student, (exam & assignment) relations), also pass filter Queries & pagination needed data
    const resultsData = await prisma.result.findMany({
      where: q,
      include: { 
        student: { select: { name: true, surname: true } },
        exam: {
          include: {
            lesson: { select: { class: { select: { name: true } }, teacher: { select: { name: true, surname: true } }} }
          },
        },
        assignment: {
          include: {
            lesson: { select: { class: { select: { name: true } }, teacher: { select: { name: true, surname: true } }} }
          },
        }
      },
      take: Items_Per_Page,
      skip: Items_Per_Page * (currentPage - 1),
    });
    const count = await prisma.result.count({ where: q });     //get filtered results count, we use it to get the numberOfPages
    return { resultsData, numberOfPages: Math.ceil(count / Items_Per_Page) };     //return filtered results data & (number of pages) that will be used in Pagination
  } catch (err) {
    console.log(err);
    //return { success: false, error: true };
  }
};
