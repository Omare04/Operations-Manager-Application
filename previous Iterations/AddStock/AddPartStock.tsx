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
  grid-template-rows: 0.5fr 1fr 1fr 2fr;
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
  grid-template-rows: 1fr 1fr 1fr;
  gap: 10px;
  padding: 6.5px;
  margin: 3px;
`;

const Styledtitle = styled.p`
  color: white;
  cursor: default;
`;

export function AddPartStock() {
  const SantizeInputs = (productType, pn, price, quantity) => {
    if (price && quantity && pn && productType.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const handleReset = () => {
    location.reload();
  };

  const Product_type = DropDownCompStatic({
    title: "Product Type",
    row: 1,
    col: 2,
    arr: [
      "Piece Avion",
      "Produit Consommable",
      "Produit Outillage",
      "Matériel de Servitude",
    ],
    placeholderprop: "Select",
  });

  const plane = DropDownCompStatic({
    title: "Plane",
    row: 2,
    col: 1,
    arr: [
      "CN-TKC",
      "CN-TME",
      "CN-TMB",
      "CN-TMH",
      "CN-TKV",
      "CN-TKI",
      "CN-TKR",
      "CN-TMV",
    ],
    placeholderprop: "Select",
  });

  const Plane = InputComp({
    title: "Plane",
    row: 2,
    col: 1,
    disabled: false,
    content: "",
  });

  const Product = InputComp({
    title: "Product",
    row: 1,
    col: 1,
    disabled: false,
    content: "",
  });

  const input = InputComp({
    title: "P/N",
    row: 1,
    col: 3,
    disabled: false,
    content: "",
  });

  const productType = InputComp({
    title: "Product Type",
    row: 1,
    col: 2,
    disabled: false,
    content: "",
  });

  const incrementer = IncrementerComp({
    title: "Price",
    row: 2,
    col: 2,
  });

  const incrementer2 = IncrementerComp({
    title: "Quantity",
    row: 2,
    col: 3,
  });

  const values = [
    input.value,
    Product.value,
    Product_type.selectedValue,
    plane.selectedValue,
    incrementer.val,
    incrementer2.val,
  ];

  const handleSubmit = () => {
    if (SantizeInputs(values[2], values[0], values[4], values[5])) {
      axios
        .post("http://localhost:3331/Maintanance_stock", {
          data: values,
        }, {withCredentials: true})
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
            <Styledtitle>Add Parts</Styledtitle>
          </Styledtitlebox>
          <Styledorderboxtop>
            {Product.render}
            {input.render}
            {plane.render}
            {incrementer.render}
            {incrementer2.render}
            {Product_type.render}
            <ButtonComponent
              type="Add"
              row="3"
              col="3"
              onClickFunction={handleSubmit}
            />
            <ButtonComponent
              type="Reset"
              row="3"
              col="2"
              onClickFunction={() => {
                location.reload();
              }}
            />
          </Styledorderboxtop>
        </StyledOrderdetailbox>
      </Grid>
    </>
  );
}

export default AddPartStock;
