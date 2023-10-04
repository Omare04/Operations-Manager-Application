import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Fetch } from "../Fetch";
import { useState, useEffect, useContext } from "react";
import { LoginContext } from "../Helper/userContext";

export function Add_OrderBox() {
  return <div>Dashboard_Components</div>;
}

const StyledNotiBoxes = styled.div`
  display: grid;
  border-radius: 10px;
  margin: 4px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 2fr 1fr;
  background: #f1f1f1;
  grid-row: 1/4;
  cursor: pointer;
  box-shadow: 0 0 52px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, background-color 0.3s ease;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }

  @media screen and (min-width: 280px) and (max-width: 500px) {
    display: ${({ sidebar }) => (sidebar ? "none" : "grid")};
  }
`;

const StyledTitle = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000000;
  grid-column: 2;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;

  @media screen and (min-width: 280px) and (max-width: 500px) {
    font-size: 10px;
    text-align: center;
  }
`;

const StyledAmmount = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  grid-row: 2;
  grid-column: 2;
  color: #000000;
  font-size: 2rem;

  @media screen and (min-width: 280px) and (max-width: 500px) {
    font-size: 1rem;
  }
`;

const StyledBorderboxtitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e2e2e2;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  grid-column: 1/5;
  border-bottom: 1.3px solid #d4d4d4;
  transition: box-shadow 0.3s ease, background-color 0.3s ease;
`;

const StyledBorderboxicon = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background: #e2e2e2;
  grid-row: 3;
  border-top: 1.3px solid #d4d4d4;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  grid-column: 1/3;
  cursor: pointer;
  transition: box-shadow 0.3s ease, background-color 0.3s ease;

  &:hover {
    color: #d30303;
  }
`;

const StyledIcon = styled.div`
  color: #000000;
  grid-row: 3;
  grid-column: 2;
  padding-left: 20px;
  padding-right: 20px;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #d30303;
  }

  @media screen and (min-width: 280px) and (max-width: 500px) {
    display: none;
  }
`;

const StyledBorderboxAmmount = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  grid-row: 2;
  grid-column: 1/5;
  transition: box-shadow 0.3s ease, background-color 0.3s ease;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

const StyledPortal = styled.p`
  color: black;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;

  @media screen and (min-width: 280px) and (max-width: 685px) {
    display: none;
    padding-right: 4px;
  }
`;

const Styledflexbottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;

  &:hover {
    ${StyledIcon}, ${StyledPortal} {
      color: #e50101;
    }
  }
`;

export function Notificationboxes({
  ammount,
  title,
  addicon,
  viewicon,
  bool,
  routeAdd,
  routeView,
  routefetch,
  type,
}) {
  const viewiconToF = (bool) => {
    if (bool == true) {
      return (
        <>
          {routeView == "Stock/MaintenanceStock" ? (
            <Link
              to={`/pages/${routeView}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Styledflexbottom>
                <StyledIcon>{viewicon} </StyledIcon>
                <StyledPortal> Maintenance Equipment</StyledPortal>
              </Styledflexbottom>
            </Link>
          ) : (
            <>
              <Link
                to={`/pages/Stock/MedicalEquipmentStock`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Styledflexbottom>
                  <StyledIcon>{viewicon} </StyledIcon>
                  <StyledPortal> Medical Equipment</StyledPortal>
                </Styledflexbottom>
              </Link>
              <Link
                to={`/pages/${routeView}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Styledflexbottom>
                  <StyledIcon>{viewicon} </StyledIcon>
                  <StyledPortal> Drugs</StyledPortal>
                </Styledflexbottom>
              </Link>
            </>
          )}
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      <StyledNotiBoxes>
        <StyledBorderboxtitle>
          <StyledTitle>{title}</StyledTitle>
        </StyledBorderboxtitle>
        <StyledBorderboxAmmount>
          <StyledAmmount>{ammount}</StyledAmmount>
        </StyledBorderboxAmmount>
        <StyledBorderboxicon>{viewiconToF(bool)}</StyledBorderboxicon>
      </StyledNotiBoxes>
    </>
  );
}

export function Out_of_stock_List() {}
