// IT APPEARS THAT BIG CALENDAR SHOWS THE LAST WEEK WHEN THE CURRENT DAY IS A WEEKEND.
// FOR THIS REASON WE'LL GET THE LAST WEEK AS THE REFERENCE WEEK BY DEFAULT.
// BUT IN THIS TUTORIAL WE'RE TAKING THE NEXT WEEK AS THE REFERENCE WEEK.


export const adjustScheduleToCurrentWeek = (lessons: { title: string; start: Date; end: Date }[]): { title: string; start: Date; end: Date }[] => {
  
  //getDay() returns the number of the current day of the week (from 0 -> 6 : Sunday -> Saturday )
  const today = new Date();
  const dayOfWeek = today.getDay();
  //if it's Sunday: then we have 6 daysSinceMonday, other days: then (currnet_day_number - 1) daysSinceMonday
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  //setting lastMonday actual date (today_number - daysSinceMonday)
  const latestMonday = today;
  latestMonday.setDate(today.getDate() - daysSinceMonday);

  //map through the received lessons to adjust the dates
  return lessons.map((lesson) => {
    //get lesson day number & use it to get its daysFromMonday
    const lessonDayOfWeek = lesson.start.getDay();
    const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;
    
    //adjusted Start Date & End Date
    const adjustedStartDate = new Date(latestMonday);
    adjustedStartDate.setDate(latestMonday.getDate() + daysFromMonday);
    adjustedStartDate.setHours( lesson.start.getHours(), lesson.start.getMinutes(), lesson.start.getSeconds());
    const adjustedEndDate = new Date(adjustedStartDate);
    adjustedEndDate.setHours(lesson.end.getHours(), lesson.end.getMinutes(), lesson.end.getSeconds());

    //return lesson object with the adjusted dates
    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
    };
  });
};