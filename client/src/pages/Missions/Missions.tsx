import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Box, Button } from "@mui/material";
import * as FaIcons from "react-icons/fa";
import { PieChart } from "recharts";
import { BarChartComp } from "./MissionCharts";
import { ActiveMissionList, PastMissionsList } from "./MissionsLists";
import {
  AddToStock,
  CreateMissionButton,
} from "../../components/content/Input_components";
import { ViewMissionModal } from "../Modals/AddStockModal";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 0.2fr 1fr 1fr 1fr;
  gap: 5px;
  padding-left: 10px;
  padding-top: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  height: 100vh;
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  grid-column: 1/4;
  background-image: linear-gradient(to right, #0080ff, #095df0);
  color: white;
  border: 1px solid #bebebe;
  border-radius: 5px;
  height: 50px;
  box-shadow: 0 0 5px #5757574a;
`;

function Missions() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([{}]);
  const [modal, setModal] = useState(false);
  const [clickMessage, setClickMessage] = useState("");
  const [clickState, setClickState] = useState(false);

  const columns = useMemo(
    () => [
      {
        accessorKey: "call_sign",
        header: "Call Sign",
        size: 150,
      },
      {
        accessorKey: "company",
        header: "Company",
        size: 150,
      },
      {
        accessorKey: "model_name",
        header: "Model",
        size: 200,
      },
      {
        accessorKey: "year",
        header: "Year",
        size: 150,
      },
    ],
    []
  );

  useEffect(() => {
    axios
      .get("http://localhost:3331/Planes")
      .then((result) => {
        setData(result.data);
        setLoading(false);
      })
      .catch((e) => {});
  }, []);

  const theme = createTheme({
    palette: {
      background: {
        default: "#e9e9e982",
        // Change to your desired background color
      },
      divider: "#000282",
    },
  });

  return (
    <>
      <Grid>
        <StyledHeader>Medical Evacuation Missions</StyledHeader>
        <ActiveMissionsBox></ActiveMissionsBox>
        <ChartBox></ChartBox>
        <PersoneleBox></PersoneleBox>
        <ExtraBox></ExtraBox>
        <PastMissionBoxes> </PastMissionBoxes>
      </Grid>
    </>
  );
}

const StyledActiveWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(#e7e7e7, #cbcbcb);
  grid-row: 2;
  border-radius: 3px;
  grid-column: 1/2;
`;

const StyledBoxHeader = styled.div`
  background-image: linear-gradient(to right, #0080ff, #095df0);
  display: flex;
  color: white;
  padding: 8px;
  padding-left: ${(props) => (props.button ? "15px" : null)};
  border-radius: 3px;
  margin: 5px;
  justify-content: ${(props) => (props.button ? "space-between" : "center")};
  /* width: 20px;  */
  align-items: center;
`;

function ActiveMissionsBox() {
  const [modal, setModal] = useState(false);
  return (
    <>
      <StyledActiveWrapper>
        <StyledBoxHeader button={true}>
          {" "}
          Active Mission(s)
          <CreateMissionButton onClickFunc={() => setModal(!modal)} />
        </StyledBoxHeader>
        <ActiveMissionList></ActiveMissionList>
      </StyledActiveWrapper>
      <ViewMissionModal open={modal} onClose={() => setModal(!modal)} />
    </>
  );
}

const StyledPieChartWrapper = styled.div`
  background-image: linear-gradient(to right, #e7e7e7, #cbcbcb);
  display: flex;
  padding-right: 10px;
  flex-direction: column;
  grid-row: 3/2;
  grid-column: 2/3;
  border-radius: 3px;
`;

const StyledPieChartHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 13px;
  padding-bottom: 16px;
`;

const StyledChartHeader = styled.div`
  display: block;
  font-size: 25px;
`;

const StyledChartWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  /* margin: 10px; */
  height: 100%;
  width: 100%;
`;

const getCurrentDate = () => {
  const date = new Date();
  return date.getFullYear();
};

function ChartBox() {
  return (
    <>
      <StyledPieChartWrapper>
        <StyledPieChartHeaderContainer>
          <span style={{ fontSize: "22px" }}>Flights Per Year </span>
          <span style={{ fontSize: "14px" }}> {getCurrentDate()} </span>
        </StyledPieChartHeaderContainer>
        <StyledChartWrapper>
          <BarChartComp />
        </StyledChartWrapper>
      </StyledPieChartWrapper>
    </>
  );
}

const StyledPersoneleWrapper = styled.div`
  display: flex;
  grid-row: 3;
  grid-column: 2/3;
  background-image: linear-gradient(#e7e7e7, #cbcbcb);
  border-radius: 10px;
`;

function PersoneleBox() {
  return (
    <>
      <StyledPersoneleWrapper>
        Most popular destinations{" "}
      </StyledPersoneleWrapper>
    </>
  );
}

const StyledExtraBoxWrapper = styled.div`
  display: flex;
  grid-row: 4;
  grid-column: 2/3;
  background-image: linear-gradient(#e7e7e7, #cbcbcb);
  border-radius: 10px;
`;

function ExtraBox() {
  return (
    <>
      <StyledExtraBoxWrapper>EXTRA</StyledExtraBoxWrapper>
    </>
  );
}

const StyledPastMissionsBox = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: 1/2;
  grid-row: 3/5;
  background-image: linear-gradient(#e7e7e7, #cbcbcb);
  border-radius: 3px;
`;

function PastMissionBoxes() {
  useEffect(() => {
    axios.get("http://localhost:3331/missions").then((result) => {

      const parsedData = JSON.parse(result.data[0].mission_data);
    });
  }, []);
  return (
    <>
      <StyledPastMissionsBox>
        {/* <StyledBoxHeader>Past Missions</StyledBoxHeader> */}
        <PastMissionsList></PastMissionsList>
      </StyledPastMissionsBox>
    </>
  );
}

export default Missions;
