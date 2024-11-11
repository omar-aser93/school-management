import prisma from "@/lib/prisma";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {     //receive prop (calender chosen day)
 
  //convert received "calender_day" from string to date, use it to get this day events: prisma.findMany(event_startTime {between day beginning & end})
  const date = dateParam ? new Date(dateParam) : new Date();      
  const data = await prisma.event.findMany({
    where: { startTime: { gte: new Date(date.setHours(0, 0, 0, 0)), lte: new Date(date.setHours(23, 59, 59, 999)) } } 
  });

  //Map through the fetched events & render them 
  return data.map((event) => (
    <div key={event.id} className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-schoolSky even:border-t-schoolPurple" >
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-gray-600">{event.title}</h1>
        <span className="text-gray-300 text-xs">
          {event.startTime.toLocaleTimeString("en-UK", { hour: "2-digit", minute: "2-digit", hour12: false })}
        </span>
      </div>
      <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
    </div>
  ));
};

export default EventList;