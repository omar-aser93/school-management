import Announcements from "@/components/general/Announcements";
import AttendanceChartContainer from "@/components/charts/AttendanceChartContainer";
import CountChartContainer from "@/components/charts/CountChartContainer";
import EventCalendarContainer from "@/components/calendars/EventCalendarContainer";
import FinanceChart from "@/components/charts/FinanceChart";
import UserCard from "@/components/general/UserCard";

const AdminPage = ({searchParams}: { searchParams: { [keys: string]: string | undefined }}) => {   //get URL params
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USERS CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="admin" />
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />          
        </div>

        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChartContainer />
          </div>
        </div>        
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer searchParams={searchParams}/>       {/* pass URL searchParams to get (?date="") */}
        <Announcements/>
      </div>
    </div>
  );
};

export default AdminPage;