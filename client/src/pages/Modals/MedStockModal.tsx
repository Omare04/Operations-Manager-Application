import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import * as FaIcons from "react-icons/fa";
import {
  IncrementerComp,
  DropDownCompStatic,
  InputComp,
  ButtonComponent,
  DateComponent,
} from "../../components/content/Input_components";
import TextField from "@mui/material/TextField";

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: opacity 0.3s ease-in-out;
`;

const ModalContent = styled.div`
  background-color: #fff;
  max-width: 400px;
  border-radius: 15px;
  border: 1px solid #838383;
  transition: opacity 0.3s ease-in-out;
`;

const Grid = styled.div`
  border-radius: 15px;
  display: grid;
  grid-template-columns: 0.2fr 1fr;
  grid-template-rows: 0.2fr 1fr;
  grid-column: 1/4;
  grid-row: 2/4;
  align-items: center;
  height: 270px;
  background-color: #cbcbcb3b;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1fr 1fr 0.5fr;
  gap: 18px;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-column: 1/4;
  grid-row: 2;
  align-items: center;
`;
const StyledExit = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  grid-column: 1;
  grid-row: 1;
  margin: 30px;

  cursor: pointer;
  &:hover {
    color: #757575;
  }
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  grid-column: 2/5;
  grid-row: 1;
  margin-right: 15px;
`;

const ButtonWrap = styled.div`
  display: flex;
  align-items: center;
  grid-column: 3;
  grid-row: 3;
`;

export default function MedStockModal({ open, data, onClose }) {
  const quantity = IncrementerComp({
    title: "Quantity",
    row: 1,
    col: 2,
  });

  const flightNo = InputComp({
    title: "Flight NO",
    row: 1,
    col: 3,
    disabled: false,
    content: null,
  });

  const type = DropDownCompStatic({
    title: "Update Type",
    row: 2,
    col: 2,
    arr: ["Remove", "Enter"],
    placeholderprop: "select",
  });

  function handleEdit(type) {
    if (type == "Remove") {
      if (data.Quantity < quantity.val) {
        alert("Please Enter a valid removal quantity");
      } else {
        axios
          .put("http://localhost:3331/Med_stock/StockRemoval", {
            currentQty: data.Quantity,
            RemovalQty: quantity.val,
            productName: data.Product_name,
            productID: data.Product_ID,
          })
          .then((result) => {
            alert(result.data.message);
            //This route is to keep track of the entry and exits of each Drugs for any given mission.
            axios
              .post("http://localhost:3331/Med_stock/UpdateEvent", {
                data: [
                  data.Product_ID,
                  data.uid,
                  quantity.val,
                  flightNo.value,
                  type,
                ],
              })
              .then((result) => {
                // console.log("UpdateEvent request success:", result);
                if (result.status === 200) {
                  location.reload();
                  ``;
                }
              })
              .catch((e) => {
                alert("Error Updating");
              });
          });
      }
    } else {
      axios
        .put("http://localhost:3331/Med_stock/StockUpdate", {
          currentQty: data.Quantity,
          RemovalQty: quantity.val,
          productName: data.Product_name,
          productID: data.Product_ID,
        })
        .then((result) => {
          alert(result.data.message);
          //This route is to keep track of the entry and exits of each Drugs for any given mission.
          axios
            .post("http://localhost:3331/Med_stock/UpdateEvent", {
              data: [
                data.Product_ID,
                data.uid,
                quantity.val,
                flightNo.value,
                type,
              ],
            })
            .then((result) => {
              if (result.status === 200) {
                location.reload();
                ``;
              }
            })
            .catch((e) => {
              alert("Error Updating");
            });
        });
    }
  }

  if (!open) return null;
  return ReactDOM.createPortal(
    <>
      <ModalWrapper>
        <ModalContent>
          <Grid>
            <StyledExit
              onClick={() => {
                onClose();
              }}
            >
              <FaIcons.FaTimes />
            </StyledExit>
            <StyledHeader>{data.Product_name}</StyledHeader>
            <ContentGrid>
              {quantity.render}
              {flightNo.render}
              {type.render}
              <ButtonComponent
                type={"submit"}
                row={2}
                col={3}
                onClickFunction={() => handleEdit(type.selectedValue)}
              />
            </ContentGrid>
          </Grid>
        </ModalContent>
      </ModalWrapper>
    </>,
    document.getElementById("portal")
  );
}

export function MedOrderModal({ open, data, onClose }) {
  if (!open) return null;

  return ReactDOM.createPortal(
    <>
      <ModalWrapper>
        <ModalContent>
          <Grid>
            <StyledExit
              onClick={() => {
                onClose();
              }}
            >
              <FaIcons.FaTimes />
            </StyledExit>
            <StyledHeader>{data.Product_name}</StyledHeader>
            <ContentGrid>
              <ButtonComponent
                type={"submit"}
                row={2}
                col={3}
                onClickFunction={() => {
                  "as";
                }}
              />
            </ContentGrid>
          </Grid>
        </ModalContent>
      </ModalWrapper>
    </>,
    document.getElementById("portal")
  );
}

export function OrderUpdateModal({ open, data, onClose, editRoute, orderId }) {
  const [productName, setProductName] = useState(null);

  const dropdown = DropDownCompStatic({
    title: "",
    row: 1,
    col: 2,
    arr: editRoute == "EditPartOrder" ? ["price", "quantity"] : ["quantity"],
    placeholderprop: "Update Value",
  });

  const value = IncrementerComp({
    title: "",
    row: 1,
    col: 3,
  });

  const handleChanges = () => {
    axios
      .put(`http://localhost:3331/Orders/${editRoute}/${orderId}`, {
        type: dropdown.selectedValue,
        value: value.val,
      })
      .then((result) => {
        alert(result.data.message);
        location.reload();
      })
      .catch((e) => {
        alert(e.message);
      });
  };

  if (!open) return null;
  return ReactDOM.createPortal(
    <ModalWrapper>
      <ModalContent>
        <Grid>
          <StyledExit
            onClick={() => {
              onClose();
            }}
          >
            <FaIcons.FaTimes />
          </StyledExit>
          <StyledHeader>
            {data.product_name} ({orderId})
          </StyledHeader>
          <ContentGrid style={{ gridTemplateRows: "1fr 1fr 1fr" }}>
            {dropdown.render}
            {value.render}
            <ButtonComponent
              type={"submit"}
              row={2}
              // col={1/3}
              onClickFunction={() => {
                handleChanges();
              }}
            />
          </ContentGrid>
        </Grid>
      </ModalContent>
    </ModalWrapper>,
    document.getElementById("portal")
  );
}

const AddGrid = styled.div`
  border-radius: 15px;
  display: grid;
  grid-template-columns: 0.2fr 1fr;
  grid-template-rows: 0.2fr 1fr;
  grid-column: 1/4;
  grid-row: 2/4;
  align-items: center;
  /* height: 370px; */
  padding-bottom: 50px;
  padding-left: 50px;
  padding-right: 50px;
  background-color: #cbcbcb3b;
`;

const AddContentGrid = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1fr 0.5fr;
  gap: 18px;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-column: 1/4;
  grid-row: 2;
  align-items: center;
`;

export function AddStockModal({ open, onClose }) {
  if (!open) return null;
  return ReactDOM.createPortal(
    <ModalWrapper>
      <ModalContent>
        <AddGrid>
          <StyledExit
            onClick={() => {
              onClose();
            }}
          >
            <FaIcons.FaTimes />
          </StyledExit>
          <StyledHeader>Add To Stock</StyledHeader>
          <AddContentGrid style={{ gridTemplateRows: "1fr 1fr 1fr" }}>
            <TextField
              id="standard-basic"
              label="Standard"
              variant="standard"
            />
            <ButtonComponent
              type={"submit"}
              row={3}
              col={"2/3"}
              onClickFunction={() => {
                handleChanges();
              }}
            />
          </AddContentGrid>
        </AddGrid>
      </ModalContent>
    </ModalWrapper>,
    document.getElementById("portal")
  );
}



