
/*we separeted FormModalContainer & FormModal components because FormModalContainer has to be server component to fetch: 
needed extra data to select from inside (create/update) forms, but formModal has to be client component as we use hooks*/
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import FormModal from "./FormModal";


//receiving props (table's page type, Form type [CRUD], data used for update form inputs defaultValues, id for delete action )        
const FormModalContainer = async ({ table, type, data, id }: {
  table: "teacher" | "student" | "parent" | "subject" | "class" | "lesson" | "exam" | "assignment" | "result" | "attendance" | "event" | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;  
}) => { 

  //clerk auth() hook to get current session_user data & get his role from the metadata
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  
  
  let relatedData = {};           //variable to store the forms relatedData after conditional test of (table_type) 
  //for (create/update) forms only, check the table type to get needed data, later we loop through this data & show it in the form so user can choose from it
  if (type !== "delete") {
    switch (table) {
      case "subject":
        //for subject form, get subject's teachers using prisma.findMany(), select only (teacher's name & surname) 
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: subjectTeachers };       //set relatedData to (subjectTeachers) to choose from & show in the table
        break;
      case "class":
        //for class form, get class's grades/teachers using prisma.findMany(), select only (grade's level / teacher's name & surname) 
        const classGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: classTeachers, grades: classGrades };   //set relatedData to (classGrades & classTeachers) to choose from & show in the table
        break;
      case "teacher":
        //for teacher form, get teacher's subjects using prisma.findMany(), select only (subject's name) 
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        relatedData = { subjects: teacherSubjects };      //set relatedData to (teacherSubjects) to choose from & show in the table
        break;
      case "student":
        //for student form, get student's grades/classes using prisma.findMany(), select only (grades's level / class & class's count used for class capacity) 
        const studentGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });
        relatedData = { classes: studentClasses, grades: studentGrades };    //set relatedData to (studentGrades & studentClasses) to choose from & show in the table
        break;
      case "exam":
        /* for exam form, get exam's lessons using prisma.findMany(), select only (lesson name) 
        but with condition if current user is teacher: only get his own lessons by his id, if admin then no condition */
        const examLessons = await prisma.lesson.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: userId! } : {}),
          },
          select: { id: true, name: true },
        });
        relatedData = { lessons: examLessons };
        break;
      default:
        break;
    }
  }

  return (
    <div className="">
      {/* FormModal component (Passing all the props we received & relatedData we fetched)  */}
      <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
    </div>
  );
};

export default FormModalContainer;