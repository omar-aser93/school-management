"use client";

//react-calendar, check the docs  : https://www.npmjs.com/package/react-calendar
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import Image from "next/image";

//Typescript Types for Calendar's selected values (check the docs)
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// TEMPORARY DUMMY DATA
const events = [
  { id: 1, title: "Lorem ipsum dolor", time: "12:00 PM - 2:00 PM", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { id: 2, title: "Lorem ipsum dolor", time: "12:00 PM - 2:00 PM", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { id: 3, title: "Lorem ipsum dolor", time: "12:00 PM - 2:00 PM", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
];


const EventCalendar = () => {

  const [value, onChange] = useState<Value>(new Date());    //state to store the Calendar's selected values (check the docs)
  return (
    <div className="bg-white p-4 rounded-md">
      <Calendar onChange={onChange} value={value} />         {/* The react-calendar */}

      {/**** The Events Div showed under the Calendar ******/}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Events</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        {/*mapping through the events array & displaying them*/}
        {events.map((event) => (
          <div key={event.id} className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-schoolSky even:border-t-schoolPurple" >
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-gray-600">{event.title}</h1>
              <span className="text-gray-300 text-xs">{event.time}</span>
            </div>
            <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;