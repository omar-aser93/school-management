"use client";

//Chart Docs : https://recharts.org/en-US/api/BarChart
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";


// CHART Component: We separate it beacause it's a client component & we needed a server component to fetch the data 
const AttendanceChart = ({data}: { data: { name: string; present: number; absent: number }[] }) => {   //receiveing props from ChartContainer component
  return (
    <ResponsiveContainer width="100%" height="90%">
    <BarChart width={500} height={300} data={data} barSize={20}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
      <XAxis dataKey="name" axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
      <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
      <Tooltip contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }} />
      <Legend align="left" verticalAlign="top" wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }} />
      <Bar dataKey="present" fill="#FAE27C" legendType="circle" radius={[10, 10, 0, 0]} />
      <Bar dataKey="absent" fill="#C3EBFA" legendType="circle" radius={[10, 10, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
  );
};

export default AttendanceChart;