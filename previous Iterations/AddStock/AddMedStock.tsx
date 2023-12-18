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
  grid-row: 2/3;
  border: 1.4px solid #c8c8c886;
  border-radius: 5px;
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

function AddMedStock() {
  const SanitizeInputs = (Name, type, Quantity, date) => {
    if (Name.length > 0 && Quantity > 0 && type != null && date != null) {
      return true;
    } else {
      return false;
    }
  };

  const textboxProduct = InputComp({
    title: "Product Name",
    row: 1,
    col: 1,
    disabled: false,
    content: null,
  });

  const dropdownstatic = DropDownCompStatic({
    title: "Product Type",
    row: 1,
    col: 2,
    arr: optionValues,
    placeholderprop: "select",
  });

  const quantity = IncrementerComp({
    title: "Quantity",
    row: 2,
    col: 1,
  });

  const date = DateComponent({
    title: "Date Of Expiration",
    row: 2,
    col: 2,
  });

  const handleSubmit = () => {
    if (
      SanitizeInputs(
        textboxProduct.value,
        dropdownstatic.selectedValue,
        quantity.val,
        date.date
      )
    ) {
      axios
        .post(
          "http://localhost:3331/Med_stock",
          {
            data: [
              dropdownstatic.selectedValue,
              textboxProduct.value,
              date.date,
              "",
              "1684438793",
              quantity.val,
            ],
          },
          { withCredentials: true }
        )
        .then((suc) => {
          axios
            .post(
              "http://localhost:3331/Med_stock/StockEntries",
              {
                data: {
                  product_name: textboxProduct.value,
                  uid: "1684438793",
                  quantity: quantity.val,
                  type: "Enter",
                },
              },
              { withCredentials: true }
            )
            .then((result) => {})
            .catch((e) => {});
          alert(suc.data.message);
          location.reload();
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
          <StyledHeader> Add Drugs</StyledHeader>
          <StyledContenBody>
            {textboxProduct.render} {dropdownstatic.render} {quantity.render}{" "}
            {date.render}
            <ButtonComponent
              type={"submit"}
              row={3}
              col={2}
              onClickFunction={handleSubmit}
            />
          </StyledContenBody>
        </StyledAddBox>
      </Grid>
    </>
  );
}

export default AddMedStock;
