"use client";

//react-calendar, check the docs  : https://www.npmjs.com/package/react-calendar
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

//Typescript Types for Calendar's selected values (check the docs)
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];


// Calendar Component: We separate it beacause it's a client component & we needed a server component to fetch the data 
const EventCalendar = () => {

  const [value, onChange] = useState<Value>(new Date());    //state to store the Calendar's selected value (check the docs)
  const router = useRouter();                               //router function, used for manual redirect

  useEffect(() => {
    if (value instanceof Date) {
      router.push(`?date=${value}`);        //when calender value change, pass it to URL param & redirect to it
    }
  }, [value, router]);

  return <Calendar value={value} onChange={onChange} />;        
};

export default EventCalendar;