import AttendanceChartContainer from "@/components/charts/AttendanceChartContainer"

const AttendanceListPage = () => {
  return (
    <div className="flex flex-col justify-center p-20 gap-10">
      <h1>Attendance this week</h1>
      <AttendanceChartContainer/>
    </div>
  )
}

export default AttendanceListPage