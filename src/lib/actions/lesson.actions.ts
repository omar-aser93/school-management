import prisma from "../prisma";             //manually created file to connect to the DB
import { Prisma } from "@prisma/client";    //getting Typescript types from the prisma schema for (query & filters)


// getLessons function, to fetch filtered lessons data
export const getLessons = async ( query: any, currentPage: number, Items_Per_Page: number, sort: any) => {
  try {
    /*we check query value, as we need to get either 1 of 3 filtered lists: 1st list (search by subject/teacher list) we get query directly from the search input   
      2nd list (lessons of specific student_by_his_class list) using the relation between lesson model & class model 
      3rd list (lessons of specific teacher list) using the relation between lesson model & teacher model */
    
    const q: Prisma.LessonWhereInput = {};          //object to store the query value after conditional test, Typescript type from "@prisma/client"
    for (const [key, value] of Object.entries(query)) {    //to check keys of an object, using (for...of statement)
      switch (key) {
        case "classId":
          q.classId = parseInt(query.classId);
          break;
        case "teacherId":
          q.teacherId = query.teacherId;
          break;
        case "search":       //showing how we can search more than one column_values
          q.OR = [         
            { subject: { name: { contains: query.search, mode: "insensitive" } } },
            { teacher: { name: { contains: query.search, mode: "insensitive" } } },
          ];
          break;
        default:
          break;
      }
    }

    //get lessons using prisma.findMany(), inclue the actual data of related models (subject & class & teacher), also pass filter Queries & pagination needed data
    const lessonsData = await prisma.lesson.findMany({
      where: q,
      include: { 
        subject: { select: { name: true } },
        class: { select: { name: true } },
        teacher: { select: { name: true, surname: true } }
      },
      take: Items_Per_Page,
      skip: Items_Per_Page * (currentPage - 1),
      orderBy: { name: sort },
    });
    const count = await prisma.lesson.count({ where: q });     //get filtered lessons count, we use it to get the numberOfPages
    return { lessonsData, numberOfPages: Math.ceil(count / Items_Per_Page) };     //return filtered lessons data & (number of pages) that will be used in Pagination
  } catch (err) {
    console.log(err);
    //return { success: false, error: true };
  }
};
