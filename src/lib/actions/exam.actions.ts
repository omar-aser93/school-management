"use server";

import { revalidatePath } from "next/cache";     //used with (post,delete,update) actions to refresh data directly after change, but not with (fetch) we use return directly
import prisma from "../prisma";                  //manually created file to connect to the DB
import { ExamSchemaType } from "../formsValidation";
import { Prisma } from "@prisma/client";         //getting Typescript types from the prisma schema for (query & filters)
import { auth } from "@clerk/nextjs/server";


// createExam Server_action, we pass (success/error State , Form Data after validation by the Zod Validation file)
export const createExam = async (currentState: { success: boolean; error: boolean }, data: ExamSchemaType) => {
  
  //get current user id & his role, we'll use it to add condition for teachers
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;  
  try {
    //first: if current user is teacher, check if the recieved lesson belongs to current teacher, if not -> {error: true} 
    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({ where: { teacherId: userId!, id: data.lessonId } });
      if (!teacherLesson) { return { success: false, error: true }; }
    }

    //prisma.create() to create new Exam in the DB, set data object with received {inputs data}
    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });
    revalidatePath("/list/exams");             //auto update the path's data after the action (create,delete,update)
    return { success: true, error: false };    //return success, will receive it in useFormState() & show it in toast
  } catch (err) {
    console.log(err);
    return { success: false, error: true };    //return error, will receive it in useFormState() & show it 
  }
};



// updateExam Server_action, we pass (success/error State , Form Data after validation by the Zod Validation file)
export const updateExam = async (currentState: { success: boolean; error: boolean }, data: ExamSchemaType) => {
 
  //get current user id & his role, we'll use it to add condition for teachers
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;  
  try {
    //first: if current user is teacher, check if the recieved lesson belongs to current teacher, if not -> {error: true} 
    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({ where: { teacherId: userId!, id: data.lessonId } });
      if (!teacherLesson) { return { success: false, error: true }; }
    }

    //prisma.update() to update an Exam by id in the DB, set data object with received {inputs data}
    await prisma.exam.update({
      where: { id: data.id },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });
    revalidatePath("/list/exams");             //auto update the path's data after the action (create,delete,update)
    return { success: true, error: false };    //return success, will receive it in useFormState() & show it in toast
  } catch (err) {
    console.log(err);
    return { success: false, error: true };    //return error, will receive it in useFormState() & show it 
  }
};



// deleteExam Server_action, we pass (success/error State, FormData directly because we're not using "react-hook-form" & Validation with delete form )
export const deleteExam = async (currentState: { success: boolean; error: boolean }, formData: FormData) => {  
  //get current user id & his role, we'll use it to add condition for teachers
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  try {
    //prisma.delete() to delete a subject in the DB by the id + condition, if current user is teacher: only get his own lessons by his id, if admin then no condition
    await prisma.exam.delete({
      where: { id: parseInt(formData.get("id") as string),
        ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });
    revalidatePath("/list/exams");             //auto update the path's data after the action (create,delete,update)
    return { success: true, error: false };    //return success, will receive it in useFormState() & show it in toast
  } catch (err) {
    console.log(err);
    return { success: false, error: true };    //return error, will receive it in useFormState() & show it 
  }
};



// getExams function, to fetch filtered Exams data 
export const getExams = async ( query: any, currentPage: number, Items_Per_Page: number, sort: any) => {
  try {
    /*we check the query value, as we need to get either 1 of 3 filtered lists: 1st list (search by exam_name list) we get query directly from the search input   
      2nd list (exams of specific student_by_his_class list) using the relation between exam model & class model
      3rd list (exams of specific teacher list) using the relation between exam model & teacher model */

    const q: Prisma.ExamWhereInput = {};       //object to store the query value after conditional test, Typescript type from "@prisma/client"
    q.lesson = {};
    for (const [key, value] of Object.entries(query)) {     //to check keys of an object, using (for...of statement)
      switch (key) {
        case "classId":
          q.lesson.classId = parseInt(query.classId);          
          break;
        case "teacherId":
          q.lesson.teacherId = query.teacherId;
          break;  
        case "search":
          q.lesson.subject = {name: { contains: query.search, mode: "insensitive" }}
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
        q.lesson.teacherId = userId!;                 //teacher gets only his lesson_exams 
        break;
      case "student":
        q.lesson.class = {
          students: { some: { id: userId! } }         //student gets only his class_exams
        };
        break;
      case "parent":
        q.lesson.class = {
          students: { some: { parentId: userId! } }   //parent gets only his children class_exams
        };
        break;
      default:
        break;
    }


    //get exams using prisma.findMany(), inclue the actual data of related models (lesson relations), also pass filter Queries & pagination needed data
    const examsData = await prisma.exam.findMany({
      where: q,
      include: { 
        lesson: {
          select: {
            subject: { select: { name: true } },
            teacher: { select: { name: true, surname: true } },
            class: { select: { name: true } },
          }
        } 
      },
      take: Items_Per_Page,
      skip: Items_Per_Page * (currentPage - 1),
      orderBy: { title: sort },
    });
    const count = await prisma.exam.count({ where: q });        //get filtered exams count, we use it to get the numberOfPages
    return { examsData, numberOfPages: Math.ceil(count / Items_Per_Page) };   //return filtered exams data & (number of pages) that will be used in Pagination
  } catch (err) {
    console.log(err);
    //return { success: false, error: true };
  }
};
  
  


  