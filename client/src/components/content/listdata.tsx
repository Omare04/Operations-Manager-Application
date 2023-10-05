import React, { useEffect, useState } from "react";
import styled from "styled-components";
import * as FaIcons from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import MedStockModal from "../../pages/Modals/MedStockModal";
import { OrderTable } from "./lists";
import { EditDrugModal } from "../../pages/Modals/AddStockModal";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 0.5fr 0.5fr 0.5fr;
  width: 100%;
  background-color: #e9e9e9;
  font-size: 14px;
`;

const StyledDropdown = styled.tr`
  align-items: center;
  justify-content: center;
  background-color: #b3a5a539;
  /* border: 1px solid #dedede; */
  max-height: ${({ isOpen }) => (isOpen ? "200px" : "0")};
  transition: max-height 0.3s ease; /* Add transition property */
  overflow: hidden; /* Add overflow property */
`;

const StyledTitle = styled.p`
  display: flex;
  align-items: center;
  padding-left: 20px;
  grid-column: 1/7;
  grid-row: 1;
  background-image: linear-gradient(to right, #dadada , #ececec);
  margin: 0px;
  /* border-bottom: 1px solid #dedede63; */
`;

const StyledQt = styled.p`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 20px;
  grid-column: 4;
  grid-row: 1;
`;

const StyledDates = styled.p`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 20px;
  ${({ gridRow }) => gridRow && `grid-row: ${gridRow};`}
  ${({ gridColumn }) => gridColumn && `grid-column: ${gridColumn};`}
`;

const StyledUserInfoWrap = styled.div`
  padding-left: 20px;
  padding-top: 20px;
  padding-bottom: 20px;

  ${({ gridRow }) => gridRow && `grid-row: ${gridRow};`}
  ${({ gridColumn }) => gridColumn && `grid-column: ${gridColumn};`}
`;

const StyledButtons = styled.div`
  grid-row: 7;
  grid-column: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 20px;
  padding-bottom: 16px;
  font-size: 15px;
  cursor: pointer;
  width: 50px;
  ${({ gridRow }) => gridRow && `grid-row: ${gridRow};`}
  ${({ gridColumn }) => gridColumn && `grid-column: ${gridColumn};`} 
    
    &:hover {
    color: #757575;
  }
`;

const StyledButtonsWrap = styled.div`
  padding-top: 16px;
  background-image: linear-gradient(to right, #ececec, #dadada);
  //#dadada
  grid-row: 7;
  grid-column: 1/6;
  display: flex;
  align-items: center;
  flex-direction: row;
`;

const StyledGridLine = styled.div`
  border-bottom: 1px solid #dedede63;
  grid-column: 1/8;
  ${({ gridRow }) => gridRow && `grid-row: ${gridRow};`}
`;

const StyledTableCell = styled.td`
  width: 100%;
`;

export function Medlistdata({
  dropdown,
  Product_ID,
  Product_name,
  Product_type,
  DateInspected,
  DateExpiry,
  Quantity,
  Location,
  UserName,
  UserId,
  OpenState,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [dateAdded, setDateAdded] = useState("N/A");

  const modalData = {
    Product_ID: Product_ID,
    uid: UserId,
    Product_name: Product_name,
    Quantity: Quantity,
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3331/Med_stock/DateEntered/${Product_ID}`)
      .then((result) => {
        if (result.data == []) {
        } else {
          setDateAdded(result.data[0].dateAdded);
        }
      })
      .catch((e) => {});
  }, [Product_ID]);

  const openArrow = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(OpenState);
  }, [OpenState]);

  function handleRemoval(id) {
    axios
      .delete(`http://localhost:3331/Med_stock/DeleteItem/${id}`, {
        params: { productName: Product_name },
      })
      .then((result) => {
        alert(result.data.message);
        location.reload();
      })
      .catch((e) => {});
  }

  return (
    <>
      {dropdown ? (
        <>
          {" "}
          <StyledDropdown isOpen={isOpen}>
            <StyledTableCell colSpan="100%">
              <Grid>
                <StyledTitle>
                  {" "}
                  {Product_name} ({Product_type})
                </StyledTitle>
                <StyledQt> Qty: {Quantity}</StyledQt>
                <StyledDates gridRow="2" gridColumn="1">
                  {" "}
                  Date Of Entry:
                </StyledDates>
                <StyledDates gridRow="2" gridColumn="2">
                  {" "}
                  Expiry Date:
                </StyledDates>
                <StyledDates gridRow="2" gridColumn="3">
                  {" "}
                  Location:
                </StyledDates>
                <StyledGridLine gridRow="2"></StyledGridLine>
                <StyledDates gridRow="3" gridColumn="1">
                  {" "}
                  {DateInspected}
                </StyledDates>
                <StyledDates gridRow="3" gridColumn="2">
                  {" "}
                  {DateExpiry}
                </StyledDates>
                <StyledDates gridRow="3" gridColumn="3">
                  {" "}
                  {Location}
                </StyledDates>
                <StyledGridLine gridRow="3"></StyledGridLine>
                <StyledUserInfoWrap gridRow="6" gridColumn="1/3">
                  Entered By: {UserName} ({UserId})
                </StyledUserInfoWrap>
                <StyledUserInfoWrap gridRow="6" gridColumn="3">
                  On: {dateAdded}
                </StyledUserInfoWrap>
                <StyledUserInfoWrap
                  gridRow="6"
                  gridColumn="4"
                ></StyledUserInfoWrap>
                <StyledUserInfoWrap
                  gridRow="6"
                  gridColumn="1/3"
                ></StyledUserInfoWrap>
                <StyledGridLine gridRow="5"></StyledGridLine>
                <StyledGridLine gridRow="6"></StyledGridLine>
                <StyledButtonsWrap>
                  <StyledButtons
                    gridRow="7"
                    gridColumn="1"
                    onClick={() => {
                      setModalOpen(true);
                    }}
                  >
                    <FaIcons.FaEdit></FaIcons.FaEdit>
                  </StyledButtons>
                  <StyledButtons
                    gridRow="7"
                    gridColumn="2"
                    onClick={() => {
                      handleRemoval(modalData.Product_ID);
                    }}
                  >
                    <FaIcons.FaTrash></FaIcons.FaTrash>
                  </StyledButtons>
                </StyledButtonsWrap>
              </Grid>
            </StyledTableCell>
          </StyledDropdown>{" "}
          {/* <MedStockModal
            open={modalOpen}
            onClose={() => {
              setModalOpen(false);
            }}
            data={modalData}
          /> */}
          <EditDrugModal
            open={modalOpen}
            onClose={() => {
              setModalOpen(false);
            }}
            data={modalData}
          />
        </>
      ) : (
        ""
      )}
    </>
  );
}

export function ActiveOrderData({ arr }) {
  const [arrow, setArrow] = useState(false);
  const openArrow = () => {
    setArrow(!arrow);
  };

  return (
    <>
      {arr.dropdown ? (
        <>
          {" "}
          <StyledDropdown>
            <StyledTableCell colSpan="100%">
              <Grid>
                <StyledTitle>
                  {" "}
                  {""} ({arr.Product_name})
                </StyledTitle>
                <StyledQt> Qty: {arr.Quantity}</StyledQt>
                <StyledDates gridRow="2" gridColumn="1">
                  {" "}
                  Status:
                </StyledDates>
                <StyledDates gridRow="2" gridColumn="2">
                  {" "}
                  Product ID:
                </StyledDates>
                <StyledDates gridRow="2" gridColumn="3">
                  {" "}
                  PO:
                </StyledDates>
                <StyledGridLine gridRow="2"></StyledGridLine>
                <StyledDates gridRow="3" gridColumn="1">
                  {" "}
                  {arr.active}
                </StyledDates>
                <StyledDates gridRow="3" gridColumn="2">
                  {" "}
                  {arr.Product_id}
                </StyledDates>
                <StyledDates gridRow="3" gridColumn="3">
                  {" "}
                  {arr.PO}
                </StyledDates>
                <StyledGridLine gridRow="3"></StyledGridLine>
                <StyledUserInfoWrap
                  gridRow="6"
                  gridColumn="1/3"
                ></StyledUserInfoWrap>
                <StyledUserInfoWrap gridRow="6" gridColumn="3">
                  On ({arr.Date})
                </StyledUserInfoWrap>
                <StyledUserInfoWrap
                  gridRow="6"
                  gridColumn="4"
                ></StyledUserInfoWrap>
                <StyledUserInfoWrap
                  gridRow="6"
                  gridColumn="1/3"
                ></StyledUserInfoWrap>
                <StyledGridLine gridRow="5"></StyledGridLine>
                <StyledGridLine gridRow="6"></StyledGridLine>
                <StyledButtonsWrap>
                  <StyledButtons gridRow="7" gridColumn="1">
                    <FaIcons.FaRetweet></FaIcons.FaRetweet>
                  </StyledButtons>
                  <StyledButtons gridRow="7" gridColumn="2">
                    <FaIcons.FaTrash></FaIcons.FaTrash>
                  </StyledButtons>
                </StyledButtonsWrap>
              </Grid>
            </StyledTableCell>
          </StyledDropdown>{" "}
        </>
      ) : (
        ""
      )}
    </>
  );
}

export function MedOrderTableData({ arr }) {
  // console.log(arr);
}
