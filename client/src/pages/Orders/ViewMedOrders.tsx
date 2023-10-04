import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import * as FaIcons from "react-icons/fa";
import styled from "styled-components";
import {
  ButtonComponent,
  ChangeOrderStatusButton,
  DropDownStatusChange,
  ExportTable,
} from "../../components/content/Input_components";
import { OrderTable, Table } from "../../components/content/lists";
import { downloadPdf } from "../../Helper/downLoadFunction";
import { getCurrentDate } from "./Add";
import { OrderGraph } from "../../components/Charts";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { StatusMessageWrapper } from "./Add";

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
  background-image: linear-gradient(to right, #0080ff, #095df0);
  border: 1px solid #bebebe;
  height: 50px;
  border-radius: 5px;
  box-shadow: 0 0 5px #5757574a;
`;

const OrderDetailsWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 55px 0.2fr 0.2fr 35px;
  grid-column: 4/7;
  grid-row: 2;
  height: 250px;
  border-radius: 5px;
  width: 100%;
`;

const OrderDetailContentMain = styled.div`
  /* gap: 3px; */
  display: grid;
  background-color: #eaeaea80;
  color: #4a4a4a;
  padding-top: 5px;
  padding-bottom: 5px;
  grid-template-columns: 0.5fr 0.5fr;
  grid-template-rows: 0.7fr 20px 60px;
  align-items: center;
  grid-row: 1/4;
  grid-column: 1/5;
`;

const OrderDetailContentPO = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
  grid-column: 1/3;
  grid-row: 1;
  height: 100%;
  font-size: 20px;
`;

const OrderDetailContentStatus = styled.div`
  display: flex;
  align-items: center;
  border-radius: 5px;
  grid-column: 2;
  padding: 10px;
  grid-column: 2;
  grid-row: 1;
  height: 100%;
  font-size: 14px;
  transition: background-color 0.1s ease-in-out;

  & > * {
    padding-left: 10px;

    color: ${(props) => {
      if (props.statusColor && props.statusColor.includes("Delivered")) {
        return "#40db15";
      } else if (props.statusColor && props.statusColor.includes("Pending")) {
        return "#f0f017";
      } else if (props.statusColor && props.statusColor.includes("active")) {
        return "#d31f1f";
      } else {
        return "#4e4e4e50";
      }
    }};
  }
`;

const OrderDetailItems = styled.div`
  display: flex;
  align-items: center;
  border-radius: 5px;
  grid-column: 2;
  display: flex;
  padding: 10px;
  grid-column: 1;
  grid-row: 3;
  height: 100%;
  font-size: 14px;
  transition: background-color 0.1s ease-in-out;
`;

const OrderDetailButtonBox = styled.div`
  display: grid;
  grid-row: 4;
  grid-column: 2;
  gap: 1px;
`;
const ChangeStatusWrap = styled.div`
  margin-right: 10px;
`;

const StyledTableHeader = styled.div`
  background-image: linear-gradient(to right, #44b761, #00a437);
  color: white;
  display: flex;
  width: 100%;
  grid-column: 1/6;
  justify-content: center;
  height: 40px;
  align-items: center;
  border-radius: 3px;
`;

export default function ViewMedOrders() {
  const [activeOrders, setActiveOrders] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [pdfTableData, setpdfTableData] = useState([{}]);

  const orderTable = OrderTable({
    route: "Orders/MedView",
    table_height: "500px",
    subMenuRoute: "MedView",
    editRoute: "EditMedOrder",
    deleteRoute: "DeleteMedItem",
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
      setOrderDetails(orderTable.Orderdetails[0]);
    }
  }, [orderTable.Orderdetails[0]]);

  useEffect(() => {
    if (orderDetails != {} && orderDetails) {
      axios
        .get(`http://localhost:3331/Orders/ExportMedPO/${orderDetails.PO}`)
        .then((result) => {
          setpdfTableData(result.data.payload);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [orderDetails]);

  const handlePdfExport = (pdfData) => {
    if (pdfData.length > 0) {
      const user = [
        {
          email: "clinicalmanager@airocean.ma",
          phoneNumber: "+212668782690",
          fname: "Reda",
          lname: "",
        },
      ];

      axios
        .get("http://localhost:3331/Services/generateTableRoute", {
          params: {
            type: "MedicineOrder",
            td: pdfData,
            headers: ["Product", "Type", "Quantity"],
            user: user,
            columnWidths: [300, 200, 60],
            title: "AOM Air Ambulance",
          },
          responseType: "blob",
        })
        .then((result) => {
          downloadPdf(pdfData[0].PO, result.data);
        });
    } else {
      alert("Please Select An Order To Export");
    }
  };

  return (
    <>
      <Grid>
        <StyledHeader>
          {" "}
          Orders <FaIcons.FaCartArrowDown style={{ paddingLeft: "5px" }} />{" "}
        </StyledHeader>
        <TableWrap>
          <StyledTableHeader>Active Orders</StyledTableHeader>
          {orderTable.render}
        </TableWrap>
        <OrderSummaryBox
          orderDetails={orderDetails}
          pdfData={pdfTableData}
          type="Medical"
          changeStatusRoute={"ChangeMedStatus"}
          exportPdfFunction={() => handlePdfExport(pdfTableData)}
        />
      </Grid>
    </>
  );
}

export function OrderSummaryBox({
  orderDetails,
  pdfData,
  type,
  changeStatusRoute,
  exportPdfFunction,
}) {
  const [loading, setLoading] = useState(false);
  const [circularProgressloading, setCircularProgressLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({});

  function successStatus() {
    return ReactDOM.createPortal(
      <>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
          onClick={() => {
            setLoading(!loading);
            setStatusMessage(!statusMessage);
            location.reload();
          }}
        >
          {circularProgressloading && (
            <StatusMessageWrapper>
              <CircularProgress color="primary" />
            </StatusMessageWrapper>
          )}
        </Backdrop>
      </>,
      document.getElementById("portal")
    );
  }

  const changeStatus = DropDownStatusChange({
    title: "",
    arr: ["Delivered"],
    placeholderprop: "Change Status",
  });

  const handleChanges = (PO, status, route) => {
    if (PO != null && status != null) {
      setLoading(true);
      setCircularProgressLoading(true);
      axios
        .put(`http://localhost:3331/Orders/${route}/${PO}/${status}`)
        .then((result) => {
          setTimeout(() => {
            setCircularProgressLoading(false);
            setStatusMessage({ loading: true, status: "Success" });
            location.reload();
          }, 2000);
        })
        .catch((e) => {
          alert(e.message);
        });
    } else {
      alert("Please Select An option");
    }
  };

  return (
    <>
      <OrderDetailsWrap>
        <OrderDetailContentMain>
          <OrderDetailContentPO>
            {orderDetails
              ? orderDetails.PO == null
                ? "Purchase Order"
                : orderDetails.PO
              : null}{" "}
          </OrderDetailContentPO>
          <OrderDetailContentStatus
            style={{ justifyContent: "flex-end" }}
            statusColor={orderDetails ? orderDetails.active : null}
          >
            {orderDetails
              ? orderDetails.active == null
                ? "Status"
                : orderDetails.active
              : null}
            <FaIcons.FaCircle />
          </OrderDetailContentStatus>
          <OrderDetailContentPO
            style={{
              gridRow: "2",
              fontSize: "12px",
              borderBottom: "1px solid #dfdfdfa4",
              paddingBottom: "4px",
            }}
          >
            {type == "Medical"
              ? orderDetails.FormattedDate == null
                ? "Date"
                : orderDetails.FormattedDate
              : orderDetails.FormattedDate == null
              ? "Date"
              : orderDetails.FormattedDate}
          </OrderDetailContentPO>
          <OrderDetailItems>
            Items: {pdfData.length == 0 ? 0 : pdfData.length}
          </OrderDetailItems>
          <ChangeStatusWrap>{changeStatus.render}</ChangeStatusWrap>
        </OrderDetailContentMain>
        <OrderDetailButtonBox>
          <ExportTable
            title={"Export"}
            onClickFunction={exportPdfFunction}
          ></ExportTable>
        </OrderDetailButtonBox>
        <OrderDetailButtonBox style={{ gridColumn: "1" }}>
          <ChangeOrderStatusButton
            onClickFunction={() =>
              handleChanges(
                orderDetails.PO,
                changeStatus.selectedValue,
                changeStatusRoute
              )
            }
          />
        </OrderDetailButtonBox>
        {successStatus()}
      </OrderDetailsWrap>
    </>
  );
}
