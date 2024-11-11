import Announcements from "@/components/general/Announcements";
import BigCalendarContainer from "@/components/calendars/BigCalendarContainer";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";


const ParentPage = async () => {

  const { userId } = auth();                 //clerk auth() hook to get current session_user data
  //get the students of the current parent_user using his id, then map through childrens data & pass the classId to the Calendar
  const students = await prisma.student.findMany({ where: { parentId: userId! } });

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}      
        {students.map((student) => (
          <div className="w-full xl:w-2/3" key={student.id}>
            <div className="h-full bg-white p-4 rounded-md">
              <h1 className="text-xl font-semibold"> Schedule ({student.name + " " + student.surname}) </h1>
              <BigCalendarContainer type="class" id={student.classId}/>      {/* pass the type "class" & the id */}
            </div>
          </div>
        ))}      

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;