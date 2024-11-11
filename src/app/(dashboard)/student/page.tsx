import Announcements from "@/components/general/Announcements";
import BigCalendarContainer from "@/components/calendars/BigCalendarContainer";
import EventCalendarContainer from "@/components/calendars/EventCalendarContainer";
import { getStudent } from "@/lib/actions/student.actions";
import { auth } from "@clerk/nextjs/server";



const StudentPage = async ({searchParams}: { searchParams: { [keys: string]: string | undefined }}) => {   //get URL params
  
  const {userId} = auth();                 //clerk auth() hook to get current session_user data
  //get the current student by id, then use the student data & pass his classId to the Calendar  
  const student = await getStudent(userId as string); 
  
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule ({student?.class.name})</h1>
          <BigCalendarContainer type="class" id={student?.classId!}/>     {/* pass the type "class" & the id */}
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer searchParams={searchParams}/>       {/* pass URL searchParams to get (?date="") */}
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;