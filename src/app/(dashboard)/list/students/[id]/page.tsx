import Announcements from "@/components/general/Announcements";
import BigCalendarContainer from "@/components/calendars/BigCalendarContainer"
import Performance from "@/components/charts/Performance";
import FormModalContainer from "@/components/forms/FormModalContainer";
import { getStudent, getStudentAttendance } from "@/lib/actions/student.actions";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";



const SingleStudentPage = async ({params: { id }}: { params: { id: string } }) => {   //get id param from [id] folder_name

  const { sessionClaims } = auth();            //clerk auth() hook to get current session_user data
  const role = (sessionClaims?.metadata as { role?: string })?.role;    //get user role from the session metadata

  const student = await getStudent(id);                 //getStudent() function to get a single Student by id
  const percentage = await getStudentAttendance(id);    //getStudentAttendance() function to get Student's Attendance %
  if (!student) { return  notFound() }          //if no student with this id -> return not found (from next/navigation)

  

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-schoolSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image src={student.img || "/noAvatar.png"} alt="img" width={144} height={144} className="w-36 h-36 rounded-full object-cover" />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold"> {student.name + " " + student.surname}</h1>
                {role === "admin" && <FormModalContainer table="student" type="update" data={student} />}
              </div>
              <p className="text-sm text-gray-500"> Lorem ipsum, dolor sit amet consectetur adipisicing elit. </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{student.bloodType}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span> {new Intl.DateTimeFormat("en-GB").format(student.birthday)}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{student.email || "-"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{student.phone || "-"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleAttendance.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div className="">
                <h1 className="text-xl font-semibold">{percentage || "-"}%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleBranch.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div className="">
                <h1 className="text-xl font-semibold"> {student.class.name.charAt(0)}th</h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleLesson.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div className="">
                <h1 className="text-xl font-semibold">{student.class._count.lessons}</h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleClass.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div className="">
                <h1 className="text-xl font-semibold">{student.class.name}</h1>
                <span className="text-sm text-gray-400">Class</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Student&apos;s Schedule</h1>
          <BigCalendarContainer type="class" id={student?.class.id}/>     {/* pass the type "class" & class id */}
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-schoolSkyLight" href={`/list/lessons?classId=${student.class.id}`}> Student&apos;s Lessons </Link>
            <Link className="p-3 rounded-md bg-schoolPurpleLight" href={`/list/teachers?classId=${student.class.id}`}> Student&apos;s Teachers </Link>
            <Link className="p-3 rounded-md bg-pink-50" href={`/list/exams?classId=${student.class.id}`}> Student&apos;s Exams </Link>
            <Link className="p-3 rounded-md bg-schoolSkyLight" href={`/list/assignments?classId=${student.class.id}`}> Student&apos;s Assignments </Link>
            <Link className="p-3 rounded-md bg-schoolYellowLight" href={`/list/results?studentId=${student.id}`}> Student&apos;s Results </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;