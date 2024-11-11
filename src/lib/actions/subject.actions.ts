"use server";

import { revalidatePath } from "next/cache";      //used with (post,delete,update) actions to refresh data directly after change without refreshing the page, but not used with (fetch) we use return directly
import prisma from "../prisma";                   //manually created file to connect to the DB
import { SubjectSchemaType } from "../formsValidation";       //zod Schema Typescript type
import { Prisma } from "@prisma/client";          //getting Typescript types based on the prisma schema for (query & filters)


// createSubject Server_action, we pass (success/error State , Form Data after validation by the Zod Validation file)
export const createSubject = async (currentState: { success: boolean; error: boolean }, data: SubjectSchemaType) => {
  try {
    //prisma.create() to create new subject in the DB, set data object with received {inputs , data of related models}
    await prisma.subject.create({
      data: {
        name: data.name,
        //teachers separated from other inputs data because it's a (select multiple), we have to map through to set array of chosen options 
        teachers: { connect: data.teachers.map((teacherId) => ({ id: teacherId })) }     //prisma (connect) with create, (set) with update
      }
    });
    revalidatePath("/list/subjects");          //auto update the path's data after the action (create,delete,update)
    return { success: true, error: false };    //return success, will receive it in useFormState() & show it in toast
  } catch (err) {
    console.log(err);
    return { success: false, error: true };    //return error, will receive it in useFormState() & show it 
  }
};



// updateSubject Server_action, we pass (success/error State , Form Data after validation by the Zod Validation file)
export const updateSubject = async (currentState: { success: boolean; error: boolean }, data: SubjectSchemaType) => {
  try {
    //prisma.update() to update a subject in the DB by id, set data object with received {inputs , data of related models}
    await prisma.subject.update({
      where: { id: data.id },
      data: {
        name: data.name,
        //teachers separated from other inputs data because it's a (select multiple), we have to map through to set array of chosen options 
        teachers: { set: data.teachers.map((teacherId) => ({ id: teacherId })) }     //prisma (connect) with create, (set) with update
      }
    });     
    revalidatePath("/list/subjects");          //auto update the path's data after the action (create,delete,update)
    return { success: true, error: false };    //return success, will receive it in useFormState() & show it in toast
  } catch (err) {
    console.log(err);
    return { success: false, error: true };    //return error, will receive it in useFormState() & show it 
  }
};



// deleteSubject Server_action, we pass (success/error State, FormData because we're not using "react-hook-form" & Validation with delete form )
export const deleteSubject = async (currentState: { success: boolean; error: boolean }, formData: FormData) => {  
  try {
    //prisma.delete() to delete a subject in the DB by the id
    await prisma.subject.delete({
      where: { id: parseInt(formData.get("id") as string) }   //get the id from the formData (sent in a hidden form input)
    });
    revalidatePath("/list/subjects");          //auto update the path's data after the action (create,delete,update)
    return { success: true, error: false };    //return success, will receive it in useFormState() & show it in toast
  } catch (err) {
    console.log(err);
    return { success: false, error: true };    //return error, will receive it in useFormState() & show it 
  }
};



// getSubjects function, to fetch filtered Subjects data 
export const getSubjects = async ( query: any, currentPage: number, Items_Per_Page: number) => {
  try {

    //we check received query value, as we need to get (search by subject_name list) we get the query directly from the search input   
    const q: Prisma.SubjectWhereInput = {};        //object to store the query value after conditional test, Typescript type from "@prisma/client"
    for (const [key, value] of Object.entries(query)) {     //to check keys of an object, using (for...of statement)
      switch (key) {        
        case "search":
          q.name = { contains: query.search, mode: "insensitive" };
          break;
        default:
          break;
      }
    }

    //get subjects using prisma.findMany(), inclue the actual data of related model (teachers), also pass filter Queries & pagination needed data
    const subjectsData = await prisma.subject.findMany({
      where: q,
      include: { teachers: true },
      take: Items_Per_Page,
      skip: Items_Per_Page * (currentPage - 1),
    });
    const count = await prisma.subject.count({ where: q });       //get filtered subjects count, we use it to get the numberOfPages
    return { subjectsData, numberOfPages: Math.ceil(count / Items_Per_Page) };   //return filtered subjects data & (number of pages) that will be used in Pagination
  } catch (err) {
    console.log(err);
    //return { success: false, error: true };
  }
};
  
  
