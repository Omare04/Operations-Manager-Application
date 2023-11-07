import axios from "axios";
import React, { createContext, useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { TableHomePage, TableNotifications, TableStatic } from "./lists";
import { ActiveOrderData } from "./listdata";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 0.2fr 1fr 1fr 1fr;
  grid-row: 1/2;
  grid-column: 1/3;
  gap: 10px;
  padding: 5px;
  height: 200px;
`;

const TableWrap = styled.div`
  display: grid;
  grid-row: 2/3;
  grid-column: 1/4;
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2261e9dc;
  grid-column: 1/4;
  grid-row: 1;
  color: white;
  border: 1px solid #bebebe;
  height: 35px;
  border-radius: 2px;
`;

export const ActiveOrderContext = createContext([]);

export function ActiveOrders() {
  const [activeOrders, setActiveOrders] = useState([]);
  const [orderInfo, setOrderInfo] = useState([]);
  const [array, setArray] = useState([]);
  const [activeOrdersCount, setActiveOrdersCount] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3331/Orders/Active", { withCredentials: true })
      .then((res) => {
        if (!activeOrders) setActiveOrders(res.data);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  useEffect(() => {
    if (activeOrders.length > 0) {
      const fetchOrderInfo = async () => {
        try {
          const orderInfoArray = await Promise.all(
            activeOrders.map((order) =>
              axios.post(
                "http://localhost:3331/Med_Stock/GetOrderItems",
                {
                  item: order.product_id,
                },
                { withCredentials: true }
              )
            )
          );
          const orderData = orderInfoArray.map((res) => res.data);
          setOrderInfo(orderData);
        } catch (error) {
          console.error(error);
        }
      };

      fetchOrderInfo().catch((e) => {
        console.error(e);
      });
    }
  }, [activeOrders]);

  useEffect(() => {
    if (activeOrders.length > 0 && orderInfo.length > 0) {
      const newArray = activeOrders.map((order, index) => ({
        dropdown: true,
        Product_name: order.product_name,
        Product_type: order.product_type,
        PO: order.PO,
        Product_id: order.product_id,
        Quantity: order.quantity,
        Date: order.DateOrdered,
        active: order.active,
      }));
      setArray(newArray);
    }
  }, [activeOrders, orderInfo]);

  useEffect(() => {
    axios
      .get("http://localhost:3331/Orders/ActiveCount", {
        withCredentials: true,
      })
      .then((result) => {
        // console.log("here " + result);
        setActiveOrdersCount(result.data.payload);
      })
      .catch((e) => {
        // console.log(e.message);
      });
  }, [activeOrdersCount]);

  return (
    <Grid>
      <StyledHeader>Active Medical Orders: {activeOrdersCount}</StyledHeader>
      <TableWrap>
        <ActiveOrderContext.Provider value={array}>
          <TableHomePage
            arr={array}
            headers={["Product Name", "PO", "Date"]}
            dropdown={false}
            dropDownArr={array}
            table_height="293px"
          />
        </ActiveOrderContext.Provider>
      </TableWrap>
    </Grid>
  );
}

const ExpiryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 0.2fr 1fr 1fr 1fr;
  grid-row: 1/2;
  grid-column: 3/4;
  padding: 5px;
  height: 300px;
`;
export function ApproachingExpiry() {
  const [data, setData] = useState([{}]);

  useEffect(() => {
    axios
      .get(`http://localhost:3331/Med_stock/Expired`, { withCredentials: true })
      .then((res) => {
        setData(res.data);
      })
      .catch((e) => {
        // console.log(e);
      });
  }, [data]);

  return (
    <ExpiryGrid>
      <StyledHeader> Restock: {data.length}</StyledHeader>
      <TableWrap>
        <TableNotifications
          arr={data}
          td={["product_name", "Date_Of_Expiry"]}
          dropdown={false}
          dropDownArr={data}
          table_height="300px"
        />
      </TableWrap>
    </ExpiryGrid>
  );
}

const StyledChartWrap = styled.div`
  grid-column: 1;
  grid-row: 2;
  padding: 10px;
`;

export function OrderDataChart() {
  const [tableData, setTableData] = useState([{}]);

  useEffect(() => {
    axios
      .get("http://localhost:3331/Orders/OrderChart", { withCredentials: true })
      .then((result) => {
        setTableData(result.data);
      })
      .catch((e) => {});
  }, []);

  return (
    <>
      <StyledChartWrap>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            height={300}
            data={tableData}
            margin={{ top: 5, right: 20, bottom: 15, left: 0 }}
          >
            <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
            <Bar
              type="monotone"
              dataKey={"DrugOrders"}
              name="Drug Orders"
              fill="#d65656"
            />
            <Bar
              type="monotone"
              dataKey={"MaintenanceOrders"}
              name="Maintenance Orders"
              fill="#3d5bd5"
            />
            <XAxis
              dataKey="OrderMonth"
              tickFormatter={(value) => `Month: ${value}`}
            ></XAxis>
            <YAxis />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", padding: "8px" }}
              wrapperStyle={{ backgroundColor: "#c20000 ", color: "red" }}
            />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </StyledChartWrap>
    </>
  );
}
