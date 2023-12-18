import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import styled from "styled-components";
import {
  IncrementerComp,
  DropDownComp,
  DropDownCompStatic,
  InputComp,
  ButtonComponent,
  DateComponent,
} from "../../components/content/Input_components";
import axios from "axios";
import getCurrentDate from "../../App";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  height: 100vh;
  border-radius: 2px;
`;

const StyledAddBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 0.2fr 1fr 1fr 1fr;
  grid-column: 2;
  grid-row: 1/3;
  border: 1.4px solid #b1b1b1b7;
  border-radius: 2px;
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
  border-radius: 2px;
  height: 35px;
  border-radius: 2px;
`;

const StyledContenBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  grid-template-rows: 0.5fr 0.5fr 0.5fr 1fr;
  grid-column: 1/4;
  grid-row: 2/5;
  padding: 14px;
  align-items: start;
`;

const StyledContentData = styled.div`
  display: flex;
`;

const optionValues = [
  "Cardiology",
  "PainKiller",
  "Anitbiotic",
  "Gastroenterology",
  "Pulmonary, ORL, Allergy",
  "Psychiatry, Neurology, Sedation",
  "Solutes, Glucose",
  "Various",
];

function AddPlane() {

  const SanitizeInputs = (callSign, Year, Model, Company) => {
    if (
      callSign.length > 0 &&
      Year > 0 &&
      Model.length > 0 &&
      Company.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  const callSign = InputComp({
    title: "Call Sign",
    row: 1,
    col: 1,
    disabled: false,
    content: null,
  });

  const Company = InputComp({
    title: "Company",
    row: 1,
    col: 2,
    disabled: false,
    content: null,
  });
   
  const Year = IncrementerComp({
      title: "Year",
      row: 2,
      col: 1,
    });
    
    const Model= InputComp({
      title: "Model",
      row: 2,
      col: 2,
      disabled: false,
      content: null,
    });



  const handleSubmit = () => {
    if (
      SanitizeInputs(
        callSign.value,
        Year.val,
        Model.value,
        Company.value
      )
    ) {
      axios
        .post("http://localhost:3331/planes/Add", {
          data: [
            callSign.value,
            Company.value,
            Model.value,
            Year.val,
          ],
        }, {withCredentials: true})
        .then((suc) => {
          alert(suc.data.message);
        })
        .catch((e) => {
          alert(e.data.message);
        });
    } else {
      alert("Please Enter The Fields Correctly");
    }
  };

  return (
    <>
        <Grid>
          <StyledAddBox>
            <StyledHeader> Add Plane</StyledHeader>
            <StyledContenBody>
              {callSign.render} {Company.render} {Year.render}{" "}
              {Model.render}
              <ButtonComponent
                type={"submit"}
                row={3}
                col={1}
                onClickFunction={handleSubmit}
              />
            </StyledContenBody>
          </StyledAddBox>
        </Grid>
    </>
  );
}

export default AddPlane;
