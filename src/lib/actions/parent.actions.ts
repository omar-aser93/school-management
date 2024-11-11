import prisma from "../prisma";               //manually created file to connect to the DB
import { Prisma } from "@prisma/client";      //getting Typescript types from the prisma schema for (query & filters)


// getParents function, to fetch filtered parents data
export const getParents = async (query: any, currentPage: number, Items_Per_Page: number) => {
  try {

    //we check received query value, as we need to get (search by parent_name list) we get the query directly from the search input   
    const q: Prisma.ParentWhereInput = {};     //object to store the query value after conditional test, Typescript type from "@prisma/client"
    for (const [key, value] of Object.entries(query)) {       //to check keys of an object, using (for...of statement)
      switch (key) {        
        case "search":
          q.name = { contains: query.search, mode: "insensitive" };
          break;
        default:
          break;
      }
    }

    //get parents using prisma.findMany(), inclue the actual data of related model (students), also pass filter Queries & pagination needed data
    const parentsData = await prisma.parent.findMany({
      where: q,
      include: { students: true },
      take: Items_Per_Page,
      skip: Items_Per_Page * (currentPage - 1),
    });
    const count = await prisma.parent.count({ where: q });     //get filtered parents count, we use it to get the numberOfPages
    return { parentsData, numberOfPages: Math.ceil(count / Items_Per_Page) };   //return filtered parents data & (number of pages) that will be used in Pagination
  } catch (err) {
    console.log(err);
    //return { success: false, error: true };
  }
};
