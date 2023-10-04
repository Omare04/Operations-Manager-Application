import * as React from "react";
import styled from "styled-components";
import { Notificationboxes } from "./Dashboard_Components";
import * as FaIcons from "react-icons/fa";
import { useEffect, useState, useContext } from "react";
import { Fetch } from "../Fetch";
import { LoginContext } from "../Helper/userContext";
import { useAuthWrapper } from "../Hooks/useAuth";
import {
  ActiveOrders,
  ApproachingExpiry,
  OrderDataChart,
} from "../components/content/HomeBoxes";
import axios from "axios";
import { SupplierStatsGraph } from "./Suppliers";
import { MissionHomeBox } from "../pages/Missions/MissionHomeBox";

const Grid = styled.div`
  display: grid;
  grid-row: 1/6;
  grid-column: 1/4;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 0.2fr 340px, 250px;
  overflow: auto;
  gap: 10px;
  padding-left: 10px;
  padding-top: 10px;
  padding-right: 10px;
  padding-bottom: 16px;
  z-index: 1;
`;

const StyledGridBoxBig = styled.div`
  padding: 6px;
  display: grid;
  grid-template-columns: 1fr;
  background-color: white;
  box-shadow: 0 0 52px rgba(0, 0, 0, 0.096);
  border-radius: 4px;
  grid-template-rows: 37px 310px;
  grid-column: 2/4;
  grid-row: 2;
  z-index: 3;

  @media screen and (min-width: 280px) and (max-width: 500px) {
    display: none;
  }
`;

const StyledGridBoxMissions = styled.div`
  /* background-color: #757575; */
  grid-column: 1/4;
  grid-row: 4;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledGridBoxMed = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  /* border: 2px solid red;  */
  border-radius: 10px;
  grid-column: 1/4;
  grid-row: 1/2;
  height: 170px;
  gap: 5px;
  z-index: 3;
`;

const StyledGridBoxMed2 = styled.div`
  padding: 6px;
  display: grid;
  grid-template-columns: 1fr;
  box-shadow: 0 0 52px rgba(0, 0, 0, 0.096);
  border-radius: 4px;
  grid-template-rows: 37px 310px;
  background: #ffffff;
  grid-column: 1/2;
  grid-row: 2;
  @media screen and (min-width: 300px) and (max-width: 500px) {
    display: none;
  }
`;

const StyledChartTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  grid-row: 1;
  grid-column: 1;
  width: 100%;
  background-image: linear-gradient(to right, #0080ff , #095df0);
  color: white;
  border: 1px solid #bebebe;
  border-radius: 2px;
`;

const StyledSupplierChartTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  grid-row: 1;
  grid-column: 1/4;
  width: 100%;
  background-image: linear-gradient(to right, #0080ff , #095df0);
  color: white;
  border: 1px solid #bebebe;
  border-radius: 2px;
`;

const ColorWrapper = styled.div`
background-image: linear-gradient( #f5f5f5, #515151b9);
  /* border-top: 2px solid #378638; */
  height: 100vh;
  width: 100%;
  grid-row: 1/3;
  grid-column: 1/4;
  /* z-index: 0;  */
`;

const BackgroundWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
`;

const getYear = () => {
  const date = new Date();
  return date.getFullYear();
};

function Home() {
  const [medicalStock, setMedicalStock] = useState(null);
  const [maintenanceStock, setMaintenanceStock] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3331/Maintanance_stock/TotalStock")
      .then((result) => {
        setMaintenanceStock(result.data[0].total);
      });
    axios.get("http://localhost:3331/Med_stock/TotalStock").then((result) => {
      setMedicalStock(result.data[0].total);
    });
  }, [maintenanceStock, medicalStock]);

  return (
    <>
      <BackgroundWrapper>
        <ColorWrapper />
        <Grid>
          <StyledGridBoxMed>
            <Notificationboxes
              ammount={maintenanceStock}
              title="Maintanace Stock Items"
              addicon={<FaIcons.FaPlus />}
              viewicon={<FaIcons.FaEye />}
              bool={true}
              routeAdd={"AddStock/AddPartStock"}
              routeView={"Stock/MaintenanceStock"}
            ></Notificationboxes>
            <Notificationboxes
              ammount={medicalStock}
              title="Medical Stock Items"
              addicon={<FaIcons.FaPlus />}
              viewicon={<FaIcons.FaEye />}
              bool={true}
              routeView={"Stock/Drug_stock"}
              routeAdd={"Stock/MedicalEquipmentStock"}
            ></Notificationboxes>
            <Notificationboxes
              ammount={22}
              title="Out Of Stock"
              addicon={<FaIcons.FaBox />}
              viewicon={null}
              bool={false}
              routeAdd={null}
              routeView={null}
            ></Notificationboxes>
          </StyledGridBoxMed>
          <StyledGridBoxBig>
            {/* <ActiveOrders /> <ApproachingExpiry /> */}
            <StyledSupplierChartTitle>
              {getYear()} Orders By Suppliers
            </StyledSupplierChartTitle>
            <SupplierStatsGraph />
          </StyledGridBoxBig>
          <StyledGridBoxMed2>
            <StyledChartTitle>{getYear()} Orders</StyledChartTitle>
            <OrderDataChart></OrderDataChart>
          </StyledGridBoxMed2>
          <StyledGridBoxMissions>
            <MissionHomeBox />
          </StyledGridBoxMissions>
        </Grid>
      </BackgroundWrapper>
    </>
  );
}

export default Home;
