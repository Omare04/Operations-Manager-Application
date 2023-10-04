import * as React from "react";
import Layout from "../../components/layout/Layout";
import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import {
  DropDownComp,
  DropDownCompStatic,
  InputComp,
  IncrementerComp,
  ButtonComponent,
} from "../../components/content/Input_components";
import { Table, TableStatic } from "../../components/content/lists";
import { ordercode } from "./Add";
import { RadioComponent } from "../../components/content/Input_components";
import axios from "axios";
import { getCurrentDate } from "./Add";
import { LoginContext } from "../../Helper/userContext";
import { parse } from "node:path/win32";
import { downloadPdf } from "../../Helper/downLoadFunction";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr 1fr 1fr 0.5fr 1fr 1fr 0.5fr;
  gap: 10px;
  padding-left: 10px;
  padding-top: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  height: 100vh;
`;

const StyledOrderdetailbox = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: 0.5fr 1fr 1fr 1fr;
  background: #ffffff;
  border: 2px solid #f4f4f4;
  border-radius: 5px;
  grid-column: 1;
  grid-row: 1/3;

  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }

  @media screen and (min-width: 280px) and (max-width: 500px) {
    display: none;
  }
`;

const Styledtitle = styled.p`
  color: white;
  cursor: default;
`;

const Styledtitlebox = styled.p`
  display: grid;
  justify-content: center;
  align-items: center;
  grid-row: 1;
  grid-column: 1/4;
  background: #b4b4b4;
  margin: 0px;
  border-radius: 2px;
`;

const Styledorderboxtop = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  grid-column: 1/3;
  grid-row: 2/7;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 20px;
  padding: 6.5px;
  padding-left: 20px;
  margin: 3px;
`;

const StyledOrderList = styled.div`
  display: grid;
  box-shadow: 0 0 52px rgba(0, 0, 0, 0.1);
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 0.5fr 1fr 1fr 2fr;
  background: white;
  border-radius: 4px;
  grid-column: 2/3;
  grid-row: 1/3;
  overflow: auto;
`;

const StyledButtonbox = styled.div`
  display: grid;
  height: 50px;
  gap: 2px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  border: 2px solid #e0e0e0;
  box-shadow: 0 0 52px rgba(0, 0, 0, 0.1);
`;

const Selectbox = styled.div`
  padding-top: 5px;
  grid-row: 2;
  grid-column: 1/5;
`;
const StyledSubmit = styled.div`
  display: grid;
  height: 50px;
  gap: 2px;
  grid-template-columns: 1fr 1fr 1fr;
  border: 2px solid #e0e0e0;
  box-shadow: 0 0 52px rgba(0, 0, 0, 0.1);
  grid-column: 1/3;
  grid-row: 7/8;
`;

function Orderdetails() {
  const [numOfOrders, setNumOfOrders] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:3331/orders/DrugOrder/NumOfOrders")
      .then((res) => {
        setNumOfOrders(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

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

  const input = InputComp({
    title: "P.O",
    row: 2,
    col: 2,
    disabled: true,
    content: ordercode(numOfOrders),
  });

  const dropdown = DropDownComp({
    title: "Product name",
    row: 1,
    col: 1,
    options_data: "product_name",
    route: "Med_stock",
    placeholderprop: "Select",
  });

  const dropdownstatic = DropDownCompStatic({
    title: "Product Type",
    row: 2,
    col: 1,
    arr: optionValues,
    placeholderprop: "select",
  });

  const Incrementer = IncrementerComp({
    title: "Quantity",
    row: 1,
    col: 2,
  });

  const quantity = Incrementer.val;
  const dropdownValue = dropdown.selectedValue;
  const dropdownValueStatic = dropdownstatic.selectedValue;
  const inputValue = input.value;

  return {
    quantity,
    dropdownValueStatic,
    dropdownValue,
    inputValue,
    numOfOrders,
    render: (
      <>
        <StyledOrderdetailbox>
          <Styledtitlebox>
            <Styledtitle>Add Orders</Styledtitle>
          </Styledtitlebox>
          <Styledorderboxtop>
            {dropdown.render}
            {dropdownstatic.render}
            {Incrementer.render}
            {/* {radio.render}
            {radio2.render} */}
            {input.render}
          </Styledorderboxtop>
        </StyledOrderdetailbox>
      </>
    ),
  };
}

function Add() {
  const orderDetails = Orderdetails();
  const userSession = useContext(LoginContext);

  const [user, setUser] = useState(null);
  const [neworder, setNewOrder] = useState([]);
  const [orderInfo, setOrderInfo] = useState({});
  const [alertState, setAlertState] = useState(false);

  useEffect(() => {
    if (userSession != null) console.log(userSession.id);
  }, []);

  const Sanitize = (quantity, productName, productType) => {
    if (
      quantity < 0 ||
      quantity === 0 ||
      productType.trim() === "" ||
      productName.trim() === ""
    ) {
      alert("Please complete the order.");
      return false;
    } else {
      return true;
    }
  };

  const addOrder = (product, product_type, qty, numOfOrder) => {
    if (Sanitize(qty, product, product_type)) {
      const newOrder = {
        PO: ordercode(numOfOrder),
        Product: product,
        ProductType: product_type,
        Qty: qty,
      };
      const orderInfo = {
        uid: 1684438791,
        DateOrdered: getCurrentDate(),
        active: "active",
      };
      setNewOrder((prevOrder) => [...prevOrder, newOrder]);
      setOrderInfo(orderInfo);
    }
  };

  function successAlert(PO) {
    return (
      <Stack sx={{ width: "100%" }} spacing={2} gridColumn={1} paddingTop= {2}>
        <Alert
          onClose={() => {
            setAlertState(false);
            location.reload();
          }}
        >
          Your Order {PO} Has Been Placed
        </Alert>
      </Stack>
    );
  }

  function handleSubmitOrder() {

    const data = localStorage.getItem("Orders_info");
    const parsedData = JSON.parse(data);

    axios
      .get(`http://localhost:3331/users/${orderInfo.uid}`)
      .then((response) => {
        axios
        .get("http://localhost:3331/Services/pdfRoute", {
          params: {
            type: "Medicine",
            item: JSON.stringify(neworder),
            info: JSON.stringify(orderInfo),
            user: response.data,
          },
          responseType: "blob",
        })
        .then((res) => {
          downloadPdf(neworder[0].PO, res.data);
          axios
            .post("http://localhost:3331/Orders/DrugOrder", {
              neworder,
              orderInfo,
            })
            .then((result) => {
              const alert = setAlertState(true);
            })
            .catch((e) => {
              console.log(e.message);
            });
        })
        .catch((e) => {
          console.log(e);
        });
      })
      .catch((error) => {
        console.log(error);
      });

  }

  return (
    <>
        {alertState ? successAlert(neworder[0].PO) : null}
      <Grid>
        {orderDetails.render}
        <StyledButtonbox>
          <ButtonComponent
            type="Add"
            onClickFunction={() =>
              addOrder(
                orderDetails.dropdownValue,
                orderDetails.dropdownValueStatic,
                orderDetails.quantity,
                orderDetails.numOfOrders,
                orderDetails.inputValue
              )
            }
            row={null}
            col={2}
          />
          {/*row attribute needs to be changed, determine wether null or 1.*/}
          <ButtonComponent
            type="Reset"
            row={null}
            onClickFunction={() => {
              location.reload();
            }}
            col={1}
            row={1}
          />
        </StyledButtonbox>
        <Orderlist arr={neworder} />
        <StyledButtonbox>
          <ButtonComponent
            type="Submit"
            row={1}
            onClickFunction={handleSubmitOrder}
            col={1}
          />
        </StyledButtonbox>
      </Grid>
    </>
  );
}

function Orderlist({ arr }) {
  const Table = TableStatic({
    arr: arr,
    td: null,
    headers: ["Product Name", "Product Type", "Quantity", "PO"],
    dropdown: false,
    ordertable: null,
  });

  return (
    <>
      <StyledOrderList>
        <Styledtitlebox>
          <Styledtitle>Orders: {Table.numOfOrders}</Styledtitle>
        </Styledtitlebox>
        {Table.render}
      </StyledOrderList>
    </>
  );
}

export default Add;
