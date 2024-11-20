"use server";

import { revalidatePath } from "next/cache";   //used with (post,delete,update) actions to refresh data directly after change, but not with (fetch) we use return directly
import prisma from "../prisma";                //manually created file to connect to the DB
import { TeacherSchemaType } from "../formsValidation";
import { clerkClient } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";      //getting Typescript types from the prisma schema for (query & filters)      


// createTeacher Server_action, we pass (success/error State , Form Data after validation by the Zod Validation file)
export const createTeacher = async (currentState: { success: boolean; error: boolean }, data: TeacherSchemaType) => {
  try {
    //clerkClient.users.createUser() to create a clerk authenticated user, check him in this project clerk page
    const user = await clerkClient.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "teacher" },
    });
    //prisma.create() to create the new teacher in the DB, set data object with received inputs & relatedData 
    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        //subjects is a (select multiple), we have to map through to set array of chosen options, prisma (connect) with create / (set) with update
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({ id: parseInt(subjectId) }))
        },
      },
    });
    revalidatePath("/list/teachers");          //auto update the path's data after the action (create,delete,update)
    return { success: true, error: false };    //return success, will receive it in useFormState() & show it in toast
  } catch (err) {
    console.log(err);
    return { success: false, error: true };    //return error, will receive it in useFormState() & show it 
  }
};



// updateTeacher Server_action, we pass (success/error State , Form Data after validation by the Zod Validation file)
export const updateTeacher = async (currentState: { success: boolean; error: boolean }, data: TeacherSchemaType) => {
  if (!data.id) { return { success: false, error: true } }     //check if the user exsist by his id, if not -> error
  try {
    //clerkClient.users.updateUser(id) to update a clerk authenticated user, check him in this project clerk page
    const user = await clerkClient.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });
    //prisma.update() to update a teacher in the DB by Id, set data object with received inputs & relatedData 
    await prisma.teacher.update({
      where: { id: data.id },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        //subjects is a (select multiple), we have to map through to set array of chosen options, prisma (connect) with create / (set) with update
        subjects: {
          set: data.subjects?.map((subjectId: string) => ({ id: parseInt(subjectId) }))
        },
      },
    });
    revalidatePath("/list/teachers");          //auto update the path's data after the action (create,delete,update)
    return { success: true, error: false };    //return success, will receive it in useFormState() & show it in toast
  } catch (err) {
    console.log(err);
    return { success: false, error: true };    //return error, will receive it in useFormState() & show it 
  }
};



// deleteTeacher Server_action, we pass (success/error State, FormData directly because we're not using "react-hook-form" & Validation with delete form )
export const deleteTeacher = async (currentState: { success: boolean; error: boolean }, formData: FormData) => {
  try {
    //clerkClient.users.deleteUser() to delete a clerk user by the id, prisma.delete() to delete a teacher in the DB by the id
    await clerkClient.users.deleteUser(formData.get("id") as string);
    await prisma.teacher.delete({ where: { id: formData.get("id") as string } });
    revalidatePath("/list/teachers");          //auto update the path's data after the action (create,delete,update)
    return { success: true, error: false };    //return success, will receive it in useFormState() & show it in toast
  } catch (err) {
    console.log(err);
    return { success: false, error: true };    //return error, will receive it in useFormState() & show it 
  }
};



// getTeachers function, to fetch filtered teachers data 
export const getTeachers = async (query: any, currentPage: number, Items_Per_Page: number, sort: any) => {
  try {
    /*we check query value, as we need to get either 1 of 2 filtered lists: 1st list (search by teacher_name list) we get query directly from the search input   
      2nd list (teachers of specific student list) more complex relation query: each teacher have lessons, each lesson have the class of the student */
    
    const q: Prisma.TeacherWhereInput = {};       //object to store the query value after conditional test, Typescript type from "@prisma/client"
    for (const [key, value] of Object.entries(query)) {      //to check keys of an object, using (for...of statement)
      switch (key) {
        case "classId":
          q.lessons = {
            some: { classId: parseInt(query.classId) },
          };
          break;
        case "search":
          q.name = { contains: query.search, mode: "insensitive" };
          break;
        default:
          break;
      }
    }
    
    //get teachers using prisma.findMany(), inclue the actual data of related models (subjects,classes), also pass filter Queries & pagination needed data
    const teachersData = await prisma.teacher.findMany({
      where: q,
      include: { subjects: true, classes: true },
      take: Items_Per_Page,
      skip: Items_Per_Page * (currentPage - 1),
      orderBy: { name: sort },
    });
    const count = await prisma.teacher.count({ where: q });     //get filtered teachers count, we use it to get the numberOfPages
    return { teachersData, numberOfPages: Math.ceil(count / Items_Per_Page) };   //return filtered teachers data & (number of pages) that will be used in Pagination
  } catch (err) {
    console.log(err);
    //return { success: false, error: true };
  }
};



// getTeacher function, to get a single teacher data
export const getTeacher = async (id: string) => {
  try {
    //find a Teacher using prisma.findUnique(id) & include necessary data of related models
    return await prisma.teacher.findUnique({           
      where: { id: id },
      include: {
         _count: { select: { subjects: true, lessons: true, classes: true } }
      }
    });      
  } catch (err) {
    console.log(err);
    //return { success: false, error: true };
  }
};
