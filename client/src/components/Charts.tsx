import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import styled from "styled-components";

const StyledChartContainer = styled.div`
  grid-column: 3/7;
  grid-row: 2;
  height: 300px;
`;

export function OrderGraph({ route }) {
  const [data, setData] = useState([{}]);

  useEffect(() => {
    axios
      .get(route)
      .then((result) => {
        setData(result.data);
      })
      .catch((e) => {});
  }, []);

  return (
    <>
      <StyledChartContainer >
        <StyledChartContainer>
          <LineChart
            width={700}
            height={280}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tickFormatter={(value) => `Day: ${value}`} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="numberOfOrders"
              stroke="#e23821"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </StyledChartContainer>
      </StyledChartContainer>
    </>
  );
}
