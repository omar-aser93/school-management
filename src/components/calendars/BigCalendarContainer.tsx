import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalender";
import { adjustScheduleToCurrentWeek } from "@/lib/BigCalendarFix";


//receives 2 props, (the user_id , the lesson type: "teacher" for teacher page / "class" for student/parent page})
const BigCalendarContainer = async ({ type, id }: { type: "teacher" | "class"; id: string | number; }) => {
  
  //fetch all lessons depending on the type (lesson model contains: teacherId -> teachet relation, classId -> student/parent relation )  
  const dataRes = await prisma.lesson.findMany({
    where: { ...(type === "teacher" ? { teacherId: id as string } : { classId: id as number }) }
  });

  //map through to create the object of the lesson data in the format we will use with the calender
  const data = dataRes.map((lesson) => ({
    title: lesson.name,
    start: lesson.startTime,
    end: lesson.endTime,
  }));

  const schedule = adjustScheduleToCurrentWeek(data);       //manual function to fix a calender WEEKEND problem

  return (
    <div className="">
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;