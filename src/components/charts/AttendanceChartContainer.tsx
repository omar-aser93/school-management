import Image from "next/image";
import AttendanceChart from "./AttendanceChart";
import prisma from "@/lib/prisma";

const AttendanceChartContainer = async () => {    //The chart shows attendance of only current week starting (monday)

  //getDay() returns the number of the current day of the week (from 0 -> 6 : Sunday -> Saturday )   
  const today = new Date();
  const dayOfWeek = today.getDay();
  //if it's Sunday: then we have 6 daysSinceMonday, other days: then (currnet_day_number - 1) daysSinceMonday
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  //setting lastMonday actual date (today_number - daysSinceMonday)
  const lastMonday = new Date();  
  lastMonday.setDate(today.getDate() - daysSinceMonday);
  
  //prisma.findMany() to fetch attendance of the current week (date: greater than lastMonday )
  const resData = await prisma.attendance.findMany({ where: { date: { gte: lastMonday } }, select: { date: true, present: true } });

  //create an object, that we will use to store the fetched data in {day: {present,absent}} format  
  const attendanceMap: { [key: string]: { present: number; absent: number } } =
    {
      Mon: { present: 0, absent: 0 },
      Tue: { present: 0, absent: 0 },
      Wed: { present: 0, absent: 0 },
      Thu: { present: 0, absent: 0 },
      Fri: { present: 0, absent: 0 },
    };
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  //loop through the fetched data & update the object we created  
  resData.forEach((item) => {
    const itemDate = new Date(item.date);           //get fetched_day
    const dayOfWeek = itemDate.getDay() ;           //get fetched_day number 
    //check if it's a school day, then update the attendanceMap object {present,absent} values
    if (dayOfWeek > 0 && dayOfWeek < 6) {
      //our daysOfWeek[] starts with "Mon" at 0 index, but getDay() starts with "sun" at 0 index, so we use -1
      const dayName = daysOfWeek[dayOfWeek - 1];    
      (item.present) ? attendanceMap[dayName].present += 1 : attendanceMap[daysOfWeek[dayOfWeek]].absent += 1;      
    }
  });

  //map through to create the object that we will use for the chart , {{name: "Mon", present: 9 , absent: 0 }, ... } 
  const data = daysOfWeek.map((day) => ({
    name: day,
    present: attendanceMap[day].present,
    absent: attendanceMap[day].absent,
  }));

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      {/* CHART Component: We separate it beacause it's a client component & this is a server component to fetch the data  */}
      <AttendanceChart data={data}/>   
    </div>
  );
};

export default AttendanceChartContainer;