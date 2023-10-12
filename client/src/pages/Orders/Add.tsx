import * as React from "react";
import Layout from "../../components/layout/Layout";
import styled from "styled-components";
import { useEffect, useState } from "react";
import {
  DropDownComp,
  InputComp,
  IncrementerComp,
  ButtonComponent,
  DynamicaDropDownComp,
} from "../../components/content/Input_components";
import { Table, TableStatic } from "../../components/content/lists";
import { Fetch } from "../../Fetch";
import axios from "axios";
import { downloadPdf } from "../../Helper/downLoadFunction";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ReactDOM from "react-dom";
import * as FaIcons from "react-icons/fa";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr 0.4fr 0.5fr 1fr 1fr 0.5fr;
  gap: 10px;
  padding-left: 10px;
  padding-top: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  height: 100vh;
`;

const StyledOrderdetailbox = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 0.5fr 1fr 1fr 2fr;
  background: #ffffff;
  border: 2px solid #f4f4f4;
  grid-column: 1/2;
  grid-row: 1/3;

  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }

  @media screen and (min-width: 280px) and (max-width: 500px) {
    display: none;
  }
`;

const StyledSupplierdetailsbox = styled.div`
  display: grid;
  /* box-shadow: 0 0 52px rgba(0, 0, 0, 0.1); */
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 0.5fr 1fr 1fr 2fr;
  background: white;
  border: 2px solid #f4f4f4;
  grid-column: 2/3;
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

const StyledOrderList = styled.div`
  display: grid;
  box-shadow: 0 0 52px rgba(0, 0, 0, 0.1);
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 0.5fr 1fr 1fr 2fr;
  background: white;
  border-radius: 4px;
  grid-column: 1/3;
  grid-row: 4/6;
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
  grid-column: 1/3;
  grid-row: 3/7;
`;

const Selectbox = styled.div`
  padding-top: 5px;
  grid-row: 2;
  grid-column: 1/5;
`;

export function Orderdetails() {
  const [planeState, setPlaneState] = useState(null);
  const [productNameMatch, setProductNameMatch] = useState(null);

  const [values, setValues] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3331/Maintanance_stock", {withCredentials: true})
      .then((result) => {
        setValues(result.data);
      })
      .catch((e) => {
        alert(e);
      });
  }, []);

  const productName = DynamicaDropDownComp({
    options: values,
    optionsName: "product_name",
    placeholderText: "Select Item",
    initialVal: productNameMatch,
    disabledToF: true,
  });

  const [partNumber, setPartNumber] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3331/Maintanance_stock/pn", {withCredentials: true})
      .then((result) => {
        setPartNumber(result.data);
      })
      .catch((e) => {
        alert(e);
      });
  }, []);

  const part_number = DynamicaDropDownComp({
    options: partNumber,
    optionsName: "part_number",
    placeholderText: "Select P/N",
    initialVal: null,
    disabledToF: false,
  });

  const input2 = InputComp({
    title: "Plane",
    row: 2,
    col: 1,
    disabled: true,
    content: planeState,
  });

  const incrementer = IncrementerComp({
    title: "Price",
    row: 2,
    col: 2,
  });
  const incrementer2 = IncrementerComp({
    title: "Quantity",
    row: 1,
    col: 3,
  });

  const pn =
    part_number.selectedValue == undefined
      ? " "
      : part_number.selectedValue.value;
  const product =
    productName.selectedValue == null ? "" : productName.selectedValue.value;
  const price = incrementer.val;
  const Quantity = incrementer2.val;

  useEffect(() => {
    if (part_number.selectedValue != undefined) {
      axios
        .get(`http://localhost:3331/Maintanance_stock/MatchItemPn/${pn}`), {withCredentials: true}
        .then((result) => {
          setProductNameMatch(result.data[0].product_name);
        })
        .catch((e) => {});
    }
  }, [part_number.selectedValue]);

  useEffect(() => {
    if (productNameMatch) {
      axios
        .get(`http://localhost:3331/planes/PartMatch/${productNameMatch}`, {withCredentials: true})
        .then((res) => {
          const { data } = res;
          if (data && data.length > 0) {
            setPlaneState(data[0].call_sign);
          }
        })
        .catch((error) => {
          // console.log(error);
        });
    } else {
    }
  }, [productNameMatch]);

  return {
    productNameMatch,
    pn,
    planeState,
    price,
    Quantity,
    render: (
      <>
        <StyledOrderdetailbox>
          <Styledtitlebox>
            <Styledtitle>Add Orders</Styledtitle>
          </Styledtitlebox>
          <Styledorderboxtop>
            {productName.render}
            {part_number.render}

            {input2.render}
            {incrementer.render}
            {incrementer2.render}
          </Styledorderboxtop>
        </StyledOrderdetailbox>
      </>
    ),
  };
}

export function ordercode(numOfOrders) {
  const year = new Date().getFullYear();
  const index = 2;
  const splityear = year.toString().slice(index);
  const month = new Date().getMonth() + 1;
  return "PO" + splityear + "0" + month + numOfOrders;
}

export function getCurrentDate() {
  const currentDate = new Date();

  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const year = String(currentDate.getFullYear());

  const formattedDate = `${year}/${month}/${day}`;

  return formattedDate;
}

function Supplierdetails() {
  const [numOfOrders, setNumOfOrders] = useState(0);
  const [supplierId, setSupplierId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3331/orders/Parts/numOfOrders", {withCredentials: true})
      .then((res) => {
        setNumOfOrders(res.data);
      })
      .catch((e) => {
        // console.log(e);
      });
  }, []);

  const input = InputComp({
    title: "Order Code",
    row: 1,
    col: 1,
    disabled: true,
    content: ordercode(numOfOrders),
  });
  const input2 = InputComp({
    title: "Date Of Order",
    row: 1,
    col: 3,
    disabled: true,
    content: getCurrentDate(),
  });

  const dropdown = DropDownComp({
    title: "Supplier",
    row: 1,
    col: 2,
    options_data: "Supplier",
    route: "Supplier",
    placeholderprop: "Select",
  });

  const Ordercode = ordercode(numOfOrders);
  const DoO = getCurrentDate();
  const SupplierName = dropdown.selectedValue;

  useEffect(() => {
    if (dropdown.selectedValue !== null) {
      axios
        .get(`http://localhost:3331/Supplier/Match/${dropdown.selectedValue}`, {withCredentials: true})
        .then((result) => {
          console.log(result.data.Supplier_id);
          setSupplierId(result.data.Supplier_id);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [dropdown.selectedValue]);

  return {
    Ordercode,
    DoO,
    supplierId,
    SupplierName,
    render: (
      <StyledSupplierdetailsbox>
        <Styledtitlebox>
          <Styledtitle>Supplier Details</Styledtitle>
        </Styledtitlebox>
        <Styledorderboxtop>
          {input.render}
          {dropdown.render}
          {input2.render}
        </Styledorderboxtop>
      </StyledSupplierdetailsbox>
    ),
  };
}

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

const StyledStatusMessage = styled.h1`
  color: #00b900;
  color: ${(props) => (props.messageColor == "Error" ? "#d10202" : "#00b900")};
`;

export const StatusMessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e8e8e8;
  padding: 30px;
  border-radius: 5px;
`;

function Add() {
  const [neworder, setNewOrder] = useState([]);
  const [user, setUser] = useState(null);
  const [Supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [circularProgressloading, setCircularProgressLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({});

  const orderDetails = Orderdetails();
  const supplier = Supplierdetails();

  const Sanitize = (quantity, product, pn, supplier) => {
    console.log(quantity, product, pn, supplier);
    if (
      quantity < 0 ||
      quantity === 0 ||
      pn.trim() === "" ||
      supplier.trim() === "" ||
      product === ""
    ) {
      alert("Please complete the order.");
      return false;
    } else {
      return true;
    }
  };

  const addOrder = (
    product,
    pn,
    plane,
    price,
    qty,
    ordecode,
    DoO,
    supplier
  ) => {
    if (Sanitize(qty, product, pn, supplier)) {
      const newOrder = {
        OrderCode: ordecode,
        Qty: qty,
        uid: 1684438791,
        Product: product,
        Supplier: supplier,
        pn: pn,
        call_sign: plane,
        price: price,
        DateOfOrder: DoO,
        active: "active",
      };

      setNewOrder((prevOrder) => [...prevOrder, newOrder]);
    }
  };

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

          {statusMessage.loading ? (
            statusMessage.status == "Success" ? (
              <>
                <StatusMessageWrapper>
                  <FaIcons.FaCheck
                    style={{
                      color: "#00b900",
                      paddingRight: "15px",
                      fontSize: "80px",
                    }}
                  />
                  <StyledStatusMessage messageColor={"Success"}>
                    {supplier.Ordercode} Has Been Placed
                  </StyledStatusMessage>
                </StatusMessageWrapper>
              </>
            ) : (
              <StatusMessageWrapper>
                <FaIcons.FaExclamationCircle
                  style={{
                    color: "#d10202",
                    paddingRight: "15px",
                    fontSize: "50px",
                  }}
                />
                <StyledStatusMessage messageColor={"Error"}>
                  There Was An Error Proccessing Your Order
                </StyledStatusMessage>
              </StatusMessageWrapper>
            )
          ) : null}
        </Backdrop>
      </>,
      document.getElementById("portal")
    );
  }

  function handleSubmitOrder() {
    if (
      Sanitize(
        orderDetails.Quantity,
        orderDetails.productNameMatch,
        orderDetails.pn,
        supplier.SupplierName
      )
    )
      setLoading(true);
    setCircularProgressLoading(true);
    axios
      .get(`http://localhost:3331/users/1684438791`, {withCredentials: true})
      .then((responseUser) => {
        axios
          .get(`http://localhost:3331/Supplier/${neworder[0].Supplier}`, {withCredentials: true})
          .then((responseSupplier) => {
            console.log(responseSupplier.data);
            axios
              .get("http://localhost:3331/Services/pdfRoute", {
                params: {
                  type: "Maintenance",
                  item: JSON.stringify(neworder),
                  user: responseUser.data,
                  Supplier: responseSupplier.data[0],
                },
                responseType: "blob",
              }, {withCredentials: true})
              .then((res) => {
                downloadPdf(supplier.Ordercode, res.data);
                axios
                  .post("http://localhost:3331/Orders/PartOrder", {
                    data: neworder,
                  }, {withCredentials: true})
                  .then((result) => {
                    setTimeout(() => {
                      setCircularProgressLoading(false);
                      setStatusMessage({ loading: true, status: "Success" });
                    }, 2000);
                  })
                  .catch((e) => {
                    setStatusMessage({ loading: true, status: "Error" });
                  });
              })
              .catch((e) => {
                // Handle error
                setStatusMessage({ loading: true, status: "Error" });
              });
          })
          .catch((error) => {
            setStatusMessage({ loading: true, status: "Error" });
          });
      })
      .catch((error) => {
        setStatusMessage({ loading: true, status: "Error" });
      });
  }

  return (
    <>
      <Grid>
        {orderDetails.render}
        {supplier.render}
        <Orderlist arr={neworder} />
        <StyledButtonbox>
          <ButtonComponent
            type="Add"
            row={null}
            col={1}
            onClickFunction={() => {
              if (
                Sanitize(
                  orderDetails.Quantity,
                  orderDetails.productNameMatch,
                  orderDetails.pn,
                  supplier.SupplierName
                )
              ) {
                addOrder(
                  orderDetails.productNameMatch,
                  orderDetails.pn,
                  orderDetails.planeState,
                  orderDetails.price,
                  orderDetails.Quantity,
                  supplier.Ordercode,
                  supplier.DoO,
                  supplier.SupplierName
                );
              }
            }}
          />
          <ButtonComponent
            type="Reset"
            row={null}
            col={2}
            onClickFunction={() => {
              location.reload();
            }}
          />
        </StyledButtonbox>
        <ButtonComponent
          type="Submit Order"
          row={"6/7"}
          col={2}
          onClickFunction={handleSubmitOrder}
        />
      </Grid>
      {successStatus()}
    </>
  );
}

function Orderlist({ arr }) {
  const TableStatic1 = TableStatic({
    arr: arr,
    td: null,
    headers: [
      "PO",
      "Qty",
      "UID",
      "Product",
      "Supplier",
      "P/N",
      "Plane",
      "Price",
      "Date",
      "Status",
    ],
    dropdown: false,
    ordertable: null,
  });
  return (
    <>
      <StyledOrderList>{TableStatic1.render}</StyledOrderList>
    </>
  );
}

export default Add;
