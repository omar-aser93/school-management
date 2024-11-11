"use server";

import { revalidatePath } from "next/cache";   //used with (post,delete,update) actions to refresh data directly after change, but not with (fetch) we use return directly
import prisma from "../prisma";                //manually created file to connect to the DB
import { StudentSchemaType } from "../formsValidation";
import { clerkClient } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";       //getting Typescript types from the prisma schema for (query & filters)


// createStudent Server_action, we pass (success/error State , Form Data after validation by the Zod Validation file)
export const createStudent = async (currentState: { success: boolean; error: boolean }, data: StudentSchemaType) => {
  try {
    
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) { return { success: false, error: true } }
    
    //clerkClient.users.createUser() to create a clerk authenticated user, check him in this project clerk page
    const user = await clerkClient.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "student" },
    });
    //prisma.create() to create the new student in the DB, set data object with received inputs & relatedData  
    await prisma.student.create({
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
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });
    revalidatePath("/list/subjects");          //auto update the path's data after the action (create,delete,update)
    return { success: true, error: false };    //return success, will receive it in useFormState() & show it in toast
  } catch (err) {
    console.log(err);
    return { success: false, error: true };    //return error, will receive it in useFormState() & show it 
  }
};



// updateStudent Server_action, we pass (success/error State , Form Data after validation by the Zod Validation file)
export const updateStudent = async (currentState: { success: boolean; error: boolean }, data: StudentSchemaType) => {
  if (!data.id) { return { success: false, error: true } }     //check if the user exsist by his id, if not -> error
  try {
    //clerkClient.users.updateUser(id) to update a clerk authenticated user, check him in this project clerk page
    const user = await clerkClient.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });
    //prisma.update() to update a student in the DB by Id, set data object with received inputs & relatedData 
    await prisma.student.update({
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
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });
    revalidatePath("/list/subjects");          //auto update the path's data after the action (create,delete,update)
    return { success: true, error: false };    //return success, will receive it in useFormState() & show it in toast
  } catch (err) {
    console.log(err);
    return { success: false, error: true };    //return error, will receive it in useFormState() & show it 
  }
};



// deleteStudent Server_action, we pass (success/error State, FormData because we're not using "react-hook-form" & Validation with delete form )
export const deleteStudent = async (currentState: { success: boolean; error: boolean }, formData: FormData) => {
  const id = formData.get("id") as string;
  try {
    //clerkClient.users.deleteUser() to delete a clerk user by the id, prisma.delete() to delete a student in the DB by the id
    await clerkClient.users.deleteUser(formData.get("id") as string);      
    await prisma.student.delete({ where: { id: formData.get("id") as string } });  
    revalidatePath("/list/subjects");          //auto update the path's data after the action (create,delete,update)
    return { success: true, error: false };    //return success, will receive it in useFormState() & show it in toast
  } catch (err) {
    console.log(err);
    return { success: false, error: true };    //return error, will receive it in useFormState() & show it 
  }
};



// getStudents function, to fetch filtered Students data
export const getStudents = async (query: any, currentPage: number, Items_Per_Page: number) => {
  try {
    /*we check query value, as we need to get either 1 of 2 filtered lists: 1st list (search by student_name list) we get query directly from the search input   
      2nd list (students of specific teacher list) more complex relation query: each student have class, each class have the lessons of the teacher */

    const q: Prisma.StudentWhereInput = {};      //object to store the query value after conditional test, Typescript type from "@prisma/client"
    for (const [key, value] of Object.entries(query)) {     //to check keys of an object, using (for...of statement)
      switch (key) {
        case "teacherId":
          q.class = {
            lessons: {
              some: { teacherId: query.teacherId }
            }};
          break;
        case "search":
          q.name = { contains: query.search, mode: "insensitive" };
          break;
        default:
          break;
      }
    }
    
    //get students using prisma.findMany(), inclue the actual data of related model (class), also pass filter Queries & pagination needed data
    const studentsData = await prisma.student.findMany({
      where: q,
      include: { class: true },
      take: Items_Per_Page,
      skip: Items_Per_Page * (currentPage - 1),
    });
    const count = await prisma.student.count({ where: q });    //get filtered students count, we use it to get the numberOfPages
    return { studentsData, numberOfPages: Math.ceil(count / Items_Per_Page) };   //return filtered students data & (number of pages) that will be used in Pagination
  } catch (err) {
    console.log(err);
    //return { success: false, error: true };
  }
};



// getStudent function, to get single student data
export const getStudent = async (id: string) => {
  try {
    //find a Student using prisma.findUnique(id) & include necessary data of related models
    return await prisma.student.findUnique({             
        where: { id: id },
        include: { class: { include: { _count: { select: { lessons: true } } } } }
     });     
  } catch (err) {
    console.log(err);  
     //return { success: false, error: true };  
  }
};
