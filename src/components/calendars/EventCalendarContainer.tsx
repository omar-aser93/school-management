import Image from "next/image";
import EventCalendar from "./EventCalendar";
import EventList from "./EventList";


const EventCalendarContainer = async ({searchParams}: {searchParams: { [keys: string]: string | undefined } }) => {   
 
  const { date } = searchParams;         //receive URL search Params as prop to get "date" param, pass it to <EventList/> component
  return (
    <div className="bg-white p-4 rounded-md"> 
      <EventCalendar />                      {/* the Calendar component*/}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Events</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        <EventList dateParam={date} />       {/* The Events component, showed under the Calendar */}
      </div>
    </div>
  );
};

export default EventCalendarContainer;