import { auth } from "@clerk/nextjs/server";  
import prisma from "../prisma";               //manually created file to connect to the DB
import { Prisma } from "@prisma/client";      //getting Typescript types from the prisma schema for (query & filters)


// getAssignments function, to fetch filtered assignments data
export const getAssignments = async ( query: any, currentPage: number, Items_Per_Page: number) => {
  try {
    /*we check query value, as we need to get either 1 of 3 filtered lists: 1st list (search by subject list) we get query directly from the search input   
      2nd list (Assignments of specific student_by_his_class list) using the relation between assignment model & class model
      3nd list (Assignments of specific teacher list) using the relation between assignment model & teacher model */

    const q: Prisma.AssignmentWhereInput = {}; //object to store the query value after conditional test, Typescript type from "@prisma/client"
    q.lesson = {};
    for (const [key, value] of Object.entries(query)) {
      //to check keys of an object, using (for...of statement)
      switch (key) {
        case "classId":
          q.lesson.classId = parseInt(query.classId);
          break;
        case "teacherId":
          q.lesson.teacherId = query.teacherId;
          break;
        case "search":
          q.lesson.subject = {
            name: { contains: query.search, mode: "insensitive" },
          };
          break;
        default:
          break;
      }
    }

    // ROLE CONDITIONS (which data current user allowed to get depending on his role)       
    const { userId, sessionClaims } = auth();             //clerk auth() hook to get current session_user data 
    const role = (sessionClaims?.metadata as { role?: string })?.role;    //get user role from the session metadata
    switch (role) {
      case "admin":                                   //admin gets all the data
        break;
      case "teacher":
        q.lesson.teacherId = userId!;                 //teacher gets only his lesson_assignments 
        break;
      case "student":
        q.lesson.class = {
          students: { some: { id: userId! } }         //student gets only his class_assignments
        };
        break;
      case "parent":
        q.lesson.class = {
          students: { some: { parentId: userId! } }   //parent gets only his children class_assignments
        };
        break;
      default:
        break;
    }

    //get assignments using prisma.findMany(), inclue the actual data of related model (lesson & ...), also pass filter Queries & pagination needed data
    const assignmentsData = await prisma.assignment.findMany({
      where: q,
      include: {
        lesson: {
          select: {
            subject: { select: { name: true } },
            teacher: { select: { name: true, surname: true } },
            class: { select: { name: true } },
          },
        },
      },
      take: Items_Per_Page,
      skip: Items_Per_Page * (currentPage - 1),
    });
    const count = await prisma.assignment.count({ where: q }); //get filtered assignments count, we use it to get the numberOfPages
    return { assignmentsData, numberOfPages: Math.ceil(count / Items_Per_Page) }; //return filtered assignments data & (number of pages) that will be used in Pagination
  } catch (err) {
    console.log(err);
    //return { success: false, error: true };
  }
};
