import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 0.2fr 1fr;
  height: 150px;
  width: 100%; 
`;

export function MissionHomeBox() {
  axios.get("http://localhost:3331/");
  return (
    <>
      <Grid>
        <DrugsBox data={null}></DrugsBox>
        <MedicalEquipmentBox flightNum={"AOM-123"}></MedicalEquipmentBox>
      </Grid>
    </>
  );
}

const StyledMedicalEquipmentBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  grid-row: 2;
  grid-column: 1/2;
  /* background-color: #b300ff; */
`;

export function MedicalEquipmentBox({ flightNum }) {
  const [data, setData] = useState([{}]);


  useEffect(() => {
    axios
      .get(`http://localhost:3331/Missions/${flightNum}`)
      .then((result) => {
        setData(result.data);
      })
      .catch((e) => {});
  }, []);
  return (
    <>
      <StyledMedicalEquipmentBox></StyledMedicalEquipmentBox>
    </>
  );
}

const StyledDrugBoxGrid = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  grid-row: 2;
  grid-column: 2;
  /* background-color: blue; */
`;

export function DrugsBox({ data }) {
  return <StyledDrugBoxGrid></StyledDrugBoxGrid>;
}

export function buttons() {}
