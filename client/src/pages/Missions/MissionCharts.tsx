import axios from "axios";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from "recharts";
import styled from "styled-components";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export function BarChartComp() {

  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3331/Missions/FlightsPerPlane").then((result) => {
      setData(result.data);
    });
  }, []);



  return (
    <>
      <ResponsiveContainer width="100%" height="100%" >
        <BarChart width={600} height={200} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="call_sign" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="NumberOfFlights" name="Number Of Flights" fill="#3d5bd5" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
