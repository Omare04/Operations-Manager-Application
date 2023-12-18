import React, { useEffect, useState } from "react";
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
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  height: 100vh;
  border-radius: 2px;
`;

const StyledOrderdetailbox = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 0.2fr;
  background: #ffffff;
  border: 2px solid #f4f4f4;
  grid-column: 2/4;
  grid-row: 1/3;

  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }

  @media screen and (min-width: 280px) and (max-width: 500px) {
    display: none;
  }
`;

const Styledtitlebox = styled.p`
  display: grid;
  justify-content: center;
  align-items: center;
  grid-row: 1;
  grid-column: 1/4;
  background: #2261e9dc;
  margin: 0px;
`;

const Styledorderboxtop = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  grid-column: 1/3;
  grid-row: 2/7;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 0.1fr 1fr 1fr;
  gap: 10px;
  padding: 6.5px;
  margin: 3px;
`;

const Styledtitle = styled.p`
  color: white;
  cursor: default;
`;

const ButtonBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column: 3;
  grid-row: 3;
  height: 50px;
`;

export function AddSupplier() {
  const [planeState, setPlaneState] = useState("");

  const SantizeInputs = (name, country, email, address) => {
    if (name.length && country.length && email.length && address.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const handleReset = () => {
    location.reload();
  };

  const Supplier = InputComp({
    title: "Supplier Name",
    row: 1,
    col: 1,
    disabled: false,
    content: "",
  });

  const Country = InputComp({
    title: "Country",
    row: 1,
    col: 2,
    disabled: false,
    content: "",
  });

  const Email = InputComp({
    title: "Email",
    row: 1,
    col: 3,
    disabled: false,
    content: "",
  });
  const Address = InputComp({
    title: "Address",
    row: 2,
    col: 1,
    disabled: false,
    content: "",
  });

  const PhoneNumber = InputComp({
    title: "Phone Number",
    row: 2,
    col: 2,
    disabled: false,
    content: "",
  });

  const values = [Supplier.value, Country.value, Email.value, Address.value,PhoneNumber.value];

  const handleSubmit = () => {
    if (SantizeInputs(values[0], values[1], values[2], values[3])) {
      axios
        .post("http://localhost:3331/Supplier", {
          data: values,
        })
        .then((res) => {
          alert(res.data.message);
        })
        .catch((e) => {
          alert(e.data.message);
        });
    } else {
      alert("Please enter the fields correctly");
    }
  };

  return (
    <>
      <Grid>
        <StyledOrderdetailbox>
          <Styledtitlebox>
            <Styledtitle>Add Supplier</Styledtitle>
          </Styledtitlebox>
          <Styledorderboxtop>
            {Supplier.render}
            {Country.render}
            {Email.render}
            {Address.render}
            {PhoneNumber.render}
          </Styledorderboxtop>
        </StyledOrderdetailbox>
        <ButtonBox>
          <ButtonComponent
            type="Add"
            row="1"
            col="2"
            onClickFunction={handleSubmit}
          />
          <ButtonComponent
            type="Reset"
            row="1"
            col="1"
            onClickFunction={() => {
              location.reload();
            }}
          />
        </ButtonBox>
      </Grid>
    </>
  );
}

export default AddSupplier;
