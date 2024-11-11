"use client";

//react-big-calendar, check the docs  : https://github.com/jquense/react-big-calendar
import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useState } from "react";

const localizer = momentLocalizer(moment);    //using a DateTime library with the calender (check the docs)


// BigCalendar Component: We separate it beacause it's a client component & we needed a server component to fetch the data 
const BigCalendar = ({ data }: { data: { title: string; start: Date; end: Date }[]; }) => {     //recevie data prop

  //State to store the big-calendar current View (work_week or day) & function to handle the change of the View 
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <Calendar
      localizer={localizer}
      events={data}                      //pass the events data we received
      startAccessor="start"
      endAccessor="end"
      views={["work_week", "day"]}      //we edited the default views manually, removed month & other not neeeded views
      view={view}
      style={{ height: "98%" }}
      onView={handleOnChangeView}                  //pass the view handleOnChange function
      min={new Date(2025, 1, 0, 8, 0, 0)}          //min/max to only show the school working hours (instead of all day hours)
      max={new Date(2025, 1, 0, 17, 0, 0)}
    />
  );
};

export default BigCalendar;