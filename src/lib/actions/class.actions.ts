"use server";

import { revalidatePath } from "next/cache";     //used with (post,delete,update) actions to refresh data directly after change, but not with (fetch) we use return directly
import prisma from "../prisma";                  //manually created file to connect to the DB
import { ClassSchemaType } from "../formsValidation";         //zod Schema Typescript type
import { Prisma } from "@prisma/client";         //getting Typescript types from the prisma schema for (query & filters)


// createClass Server_action, we pass (success/error State , Form Data after validation by the Zod Validation file)
export const createClass = async (currentState: { success: boolean; error: boolean }, data: ClassSchemaType) => {
  try {
    //prisma.create() to create new class in the DB, set data object with received (inputs & related data) 
    await prisma.class.create({ data });
    revalidatePath("/list/classes");           //auto update the path's data after the action (create,delete,update)
    return { success: true, error: false };    //return success, will receive it in useFormState() & show it in toast
  } catch (err) {
    console.log(err);
    return { success: false, error: true };    //return error, will receive it in useFormState() & show it 
  }
};



// updateClass Server_action, we pass (success/error State , Form Data after validation by the Zod Validation file)
export const updateClass = async (currentState: { success: boolean; error: boolean }, data: ClassSchemaType) => {
  try {
    //prisma.update() to update a class in the DB by id, we pass the received (inputs & related data) object 
    await prisma.class.update({
      where: { id: data.id },
      data
    });
    revalidatePath("/list/classes");           //auto update the path's data after the action (create,delete,update)
    return { success: true, error: false };    //return success, will receive it in useFormState() & show it in toast
  } catch (err) {
    console.log(err);
    return { success: false, error: true };    //return error, will receive it in useFormState() & show it 
  }
};



// deleteClass Server_action, we pass (success/error State, FormData directly because we're not using "react-hook-form" & Validation with delete form )
export const deleteClass = async (currentState: { success: boolean; error: boolean }, formData: FormData) => {
  try {
    //prisma.delete() to delete a class in the DB by the id
    await prisma.class.delete({
      where: { id: parseInt(formData.get("id") as string) }   //get the id from the formData (sent in a hidden form input)
    });
    revalidatePath("/list/classes");           //auto update the path's data after the action (create,delete,update)
    return { success: true, error: false };    //return success, will receive it in useFormState() & show it in toast
  } catch (err) {
    console.log(err);
    return { success: false, error: true };    //return error, will receive it in useFormState() & show it 
  }
};



// getClasses function, to fetch filtered classes data 
export const getClasses = async ( query: any, currentPage: number, Items_Per_Page: number, sort: any) => {
  try {
    /*we check the query value, as we need to get either 1 of 2 filtered lists: 1st list (search by class_name list) we get query directly from the search input   
      2nd list (Classes of a specific supervisor_teacher list) : using the relation between class model & teacher model */

    const q: Prisma.ClassWhereInput = {};     //object to store the query value after conditional test, Typescript type from "@prisma/client"
    for (const [key, value] of Object.entries(query)) {  //to check keys of an object, using (for...of statement)
      switch (key) {
        case "supervisorId":
          q.supervisorId = query.supervisorId;
          break;
        case "search":
          q.name = { contains: query.search, mode: "insensitive" };
          break;
        default:
          break;
      }
    }

    //get classes using prisma.findMany(), inclue the actual data of related model (supervisor_teacher), also pass filter Queries & pagination needed data
    const classesData = await prisma.class.findMany({
      where: q,
      include: { supervisor: true },
      take: Items_Per_Page,
      skip: Items_Per_Page * (currentPage - 1),
      orderBy: { name: sort },
    });
    const count = await prisma.class.count({ where: q });      //get filtered classes count, we use it to get the numberOfPages
    return { classesData, numberOfPages: Math.ceil(count / Items_Per_Page) };    //return filtered classes data & (number of pages) that will be used in Pagination
  } catch (err) {
    console.log(err);
    //return { success: false, error: true };
  }
};