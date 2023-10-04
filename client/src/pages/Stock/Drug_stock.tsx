import React from "react";
import styled from "styled-components";
import { Table } from "../../components/content/lists";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 0.2fr 1fr 1fr 1fr;
  gap: 10px;
  padding-left: 10px;
  padding-top: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  height: 100vh;
  z-index: 3;
`;

const TableWrap = styled.div`
  display: grid;
  grid-row: 2/3;
  grid-column: 1/4;
  z-index: 3;
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: red;
  grid-column: 1/4;
  grid-row: 1;
  color: #ffffff;
  background-image: linear-gradient(to right, #0080ff , #095df0);
  /* border: 1px solid #bebebe; */
  height: 50px;
  font-weight: bold;
  border-radius: 5px;
  box-shadow: 0 0 5px #5757574a;
  z-index: 3;
`;

function Drug_stock() {
  return (
    <Grid>
      <StyledHeader> List Of Drugs</StyledHeader>
      <TableWrap>
        <Table
          headers={["Product", "Product-Type", "Qty", "Date Of Expiry"]}
          route="Med_stock/ListOfDrugs"
          type="product_id"
          td={["product_name", "product_type", "Quantity", "Date_Of_Expiry"]}
          dropdown={true}
          searchCategory={["product_type", "product_name", "Date_Of_Expiry"]}
          searchCategoryTitles={["Product Type", "Product Name"]}
          filterInitialVal={"product_name"}
          table_size={"550px"}
        ></Table>
      </TableWrap>
    </Grid>
  );
}

export default Drug_stock;
