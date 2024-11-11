"use client";

//Chart Docs : https://recharts.org/en-US/api/RadialBarChart
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import Image from "next/image";


// CHART Component: We separate it beacause it's a client component & we needed a server component to fetch the data 
const CountChart = ({ boys, girls }: { boys: number; girls: number }) => {      //receiveing props from ChartContainer component

  //object stores the data we will use in the chart
  const data = [
    { name: "Total", count: boys+girls, fill: "white" },
    { name: "Girls", count: girls, fill: "#FAE27C" },
    { name: "Boys", count: boys, fill: "#C3EBFA" }
  ];

  return (
    <div className="relative w-full h-[75%]">
    <ResponsiveContainer>
      <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={32} data={data} >
        <RadialBar background dataKey="count" />
      </RadialBarChart>
    </ResponsiveContainer>
    <Image src="/maleFemale.png" alt="" width={50} height={50} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
  </div>
  );
};

export default CountChart;