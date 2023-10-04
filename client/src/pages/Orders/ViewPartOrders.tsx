import axios from "axios";
import React, { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";
import styled from "styled-components";
import { OrderTable, Table } from "../../components/content/lists";
import { downloadPdf } from "../../Helper/downLoadFunction";
import { OrderSummaryBox } from "./ViewMedOrders";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 0.2fr 1fr 1fr 1fr;
  gap: 10px;
  padding-left: 10px;
  padding-top: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  height: 100vh;
`;


const TableWrap = styled.div`
  display: grid;
  grid-row: 2/3;
  grid-column: 1/4;
  width: 100%;
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: red;
  grid-column: 1/7;
  grid-row: 1;
  color: white;
  background-image: linear-gradient(to right, #0080ff , #095df0);
  border: 1px solid #bebebe;
  height: 50px;
  border-radius: 5px;
  box-shadow: 0 0 5px #5757574a;
`;

const StyledTableHeader = styled.div`
  background-color: #15ae10;
  color: white;
  display: flex;
  width: 100%;
  grid-column: 1/6;
  justify-content: center;
  height: 40px;
  align-items: center;
  border-radius: 3px;
  `;
  
  const user = [
    {
      email: "t.elmasaoudi@gmail.com",
      phoneNumber: "+212 6 61 50 67 83",
      fname: "Tarik",
      lname: "El masaoudi",
    },
  ];

  

export default function ViewPartOrders() {
  const [activeOrders, setActiveOrders] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [pdfTableData, setpdfTableData] = useState([{}]);
  const [supplierDetails, setSupplierDetails] = useState([]);

  const orderTableActive = OrderTable({
    route: "Orders/MaintenanceView",
    table_height: "500px",
    subMenuRoute: "MaintenanceView",
    editRoute: "EditPartOrder",
    deleteRoute: "DeletePartItem"
  });



  useEffect(() => {
    axios
      .get(`http://localhost:3331/Orders/ActiveCount`)
      .then((result) => {
        setActiveOrders(result.data.payload);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, [activeOrders]);

  useEffect(() => {
    if (activeOrders != null) {
      setOrderDetails(orderTableActive.Orderdetails[0]);
    }
  }, [orderTableActive.Orderdetails[0]]);

  useEffect(() => {
    if (orderDetails && activeOrders != null) {
      // Make sure orderDetails is not null or undefined
      axios
        .get(`http://localhost:3331/Orders/ExportPartPO/${orderDetails.PO}`)
        .then((result) => {
          if (result.data && result.data.length > 0) {
            // Check if result.data is not empty
            setSupplierDetails([
              {
                Supplier: result.data[0].Supplier,
                email: result.data[0].supplier_Email,
                PhoneNumber: result.data[0].supplier_phoneNumber,
                address: result.data[0].address,
                Country: result.data[0].Country,
              },
            ]);
            setpdfTableData(result.data);
          } else {
            console.log("No data found in the API response.");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [orderDetails]);

  const handlePdfExport = () => {
    axios
      .get("http://localhost:3331/Services/exportPoPdf", {
        params: {
          orderDetails: pdfTableData,
          user: user,
          Supplier: supplierDetails[0],
        },
        responseType: "blob",
      })
      .then((result) => {
        downloadPdf(pdfTableData[0].PO, result.data);
      })
      .catch((e) => {
        console.log(e);
        alert(e);
      });
  };

  return (
    <Grid>
      <StyledHeader>
        {" "}
        Orders <FaIcons.FaCartArrowDown style={{ paddingLeft: "5px" }} />{" "}
      </StyledHeader>
      <TableWrap>
        <StyledTableHeader>All Orders</StyledTableHeader>
        {orderTableActive.render}
      </TableWrap>
      <OrderSummaryBox
        orderDetails={orderDetails}
        pdfData={pdfTableData}
        type={"Parts"}
        changeStatusRoute={"ChangePartStatus"}
        exportPdfFunction={() => handlePdfExport()}
      />
    </Grid>
  );
}
