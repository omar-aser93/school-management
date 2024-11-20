//Zod forms validation file .. the Zod object is used to set (form inputs validation conditions), we will pass it to the zodResolver of "react-hook-form"
import { z } from "zod";


//teacher zod Schema
export const teacherSchema = z.object({
  id: z.string().optional(),               //optional because we need it only on update, not create
  username: z.string().min(3, { message: "Username must be at least 3 characters long!" }).max(20, { message: "Username must be at most 20 characters long!" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long!" }).optional().or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z.string().email({ message: "Invalid email address!" }).optional().or(z.literal("")),  //empty string at update, or valid email at create
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  subjects: z.array(z.string()).optional(),  // subject ids
});
export type TeacherSchemaType = z.infer<typeof teacherSchema>;          //Typescript zod Schema type



//student zod Schema
export const studentSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(3, { message: "Username must be at least 3 characters long!" }).max(20, { message: "Username must be at most 20 characters long!" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long!" }).optional().or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z.string().email({ message: "Invalid email address!" }).optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  classId: z.coerce.number().min(1, { message: "Class is required!" }),
  parentId: z.string().min(1, { message: "Parent Id is required!" }),        
});
export type StudentSchemaType = z.infer<typeof studentSchema>;      //Typescript zod Schema type



//subject zod Schema
export const subjectSchema = z.object({
  id: z.coerce.number().optional(),        //coerce: convert the id from number to string, optional: needed only in (update/delete)
  name: z.string().min(1, { message: "Subject name is required!" }),
  teachers: z.array(z.string()),    //teacher ids array
});
export type SubjectSchemaType = z.infer<typeof subjectSchema>;      //Typescript zod Schema type



//class zod Schema
export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Class name is required!" }),
  capacity: z.coerce.number().min(1, { message: "Capacity is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  supervisorId: z.coerce.string().optional(),
});
export type ClassSchemaType = z.infer<typeof classSchema>;        //Typescript zod Schema type



//exam zod Schema
export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Exam Title is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
});
export type ExamSchemaType = z.infer<typeof examSchema>;          //Typescript zod Schema type