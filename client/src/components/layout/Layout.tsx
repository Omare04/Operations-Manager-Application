import { useState, createContext, useContext } from "react";
import Header from "./Header";
import styled from "styled-components";
import NavBar from "./NavBar";
import * as FaIcons from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  SidebarDataMaintenance,
  MedicalSidebarData,
  MedicalSidebarDataRestricted,
} from "./SidebarData";
import * as React from "react";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";

const Grid = styled.div`
  display: grid;
  grid-template:
    "nav header" min-content
    "nav main" 1fr / min-content 1fr;
  height: 100vh;
  /* background-image: linear-gradient(#f5f5f5, #515151b9); */
  height: 100%;
`;

const GridNav = styled.div`
  grid-column: 1 / 2;
  grid-row: 1 / 3;
  width: ${({ sidebar }) => (sidebar ? "220px" : "45px")};
  transition: width 0.28s ease-in-out;
  background-image: linear-gradient(#252525, #3e3e3e);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1;
  overflow: hidden;
`;

const GridHeader = styled.div`
  border-bottom: 2px solid red;
  grid-area: header;
  background-image: linear-gradient(#df0000, #cb0000);
  height: 45.328px;
  display: block;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? "220px" : "45px")};
  right: 0;
  z-index: 4;
  transition: left 0.28s ease-in-out;
`;

const GridMain = styled.div`
  grid-area: main;
  /* background: #ffffff; */
  padding-top: 47.328px;
  padding-left: ${({ sidebar }) => (sidebar ? "220px" : "45px")};
  transition: padding-left 0.28s ease-in-out;
  position: relative;
`;

const GridNavItemsWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(8, 1fr);
`;

const GridNavItems = styled.div`
  display: flex;
  padding-top: 10px;
  padding-bottom: 10px;
  height: 28px;
  border-bottom-right-radius: 2px;
  border-bottom-left-radius: 2px;
  cursor: pointer;
  color: white;
  justify-content: flex-start;
  align-items: center;
  text-decoration: none;

  transition: background 0.5s ease; /* Transition background property */

  /* Define initial values for variables */
  --c1: #393939;
  --c2: #252525;
  --x: 0;

  background: linear-gradient(90deg, var(--c1), var(--c2) 51%, var(--c1))
    var(--x) / 200%;

  &:hover {
    --c1: #5b5b5b;
    --c2: #2d2d2d;
    --x: 100%; /* Change background position on hover */
    border-left: 2px solid red;
  }
`;

const StyledIcons = styled.div`
  color: white;
  transition: margin-left 0.3s ease-in-out;
  margin-left: ${({ sidebar }) => (sidebar ? "15px" : "12px")};
  display: flex;
  font-size: 13px;
  align-items: center;
  justify-content: ${({ sidebar }) => (sidebar ? "flex-start" : "center")};
`;

const StyledListitems = styled.div`
  opacity: ${({ sidebar }) => (sidebar ? "1" : "0")};
  transform: scaleY(${({ sidebar }) => (sidebar ? "1" : "0")});
  transform-origin: top;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  transition-delay: ${({ sidebar }) => (sidebar ? "0.1s" : "0s")};
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 15px;
  text-align: center;
  font-size: 13px;
  text-decoration: none;

  @media (max-width: 370px) {
    text-align: center;
  }
`;

const StyledNav = styled.nav`
  border-bottom: 2px solid #303030;
  display: flex;
  /* background-color: #8e8e8e;  */
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 45.32px;
`;

const StyledNavToggle = styled.div`
  color: white;
  font-size: 20px;
  cursor: pointer;
  margin-top: 20px;
`;

const Stylednavtitle = styled.img`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #cdcdcd;
  width: 135px;
  padding-bottom: 5px;
`;

const Styleditemtitles = styled.p`
  background-image: linear-gradient(to right, #282828, #222222);
  color: #8e8e8e;
  padding-top: 4px;
  padding-bottom: 4px;
  font-size: 15px;
  height: 25px;
  padding-left: 18px;
  text-decoration: none;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 0px;
`;

const Styledarrow = styled.div`
  position: absolute;
  right: 15px;
  font-size: 19px;

  &:hover {
    color: #767676;
  }
`;

function Layout({ children, position }) {
  const [sidebar, setSidebar] = useState(true);
  const [maintenanceSubmenuIndex, setMaintenanceSubmenuIndex] = useState(-1);
  const [medicalSubmenuIndex, setMedicalSubmenuIndex] = useState(-1);

  const toggle = () => {
    setSidebar(!sidebar);
  };

  const toggleMaintenanceSubmenu = (index) => {
    if (maintenanceSubmenuIndex === index) {
      setMaintenanceSubmenuIndex(-1);
    } else {
      setMaintenanceSubmenuIndex(index);
    }
  };

  const toggleMedicalSubmenu = (index) => {
    if (medicalSubmenuIndex === index) {
      setMedicalSubmenuIndex(-1);
    } else {
      setMedicalSubmenuIndex(index);
    }
  };

  return (
    <Grid>
      <GridHeader sidebar={sidebar}>
        <Header toggle={toggle} sidebar={sidebar} />
      </GridHeader>
      <GridNav
        sidebar={sidebar}
        onMouseOver={() => {
          setSidebar(true);
        }}
        onMouseLeave={() => {
          setSidebar(false);
        }}
      >
        <StyledNav>
          <NavBar visible={sidebar} />
          {sidebar ? (
            <Stylednavtitle src={"../../../public/AOM_logo_horizontal.png"} />
          ) : (
            <img
              src={"../../../public/aomlogo.png"}
              style={{ height: "40px" }}
            />
          )}
        </StyledNav>
        <GridNavItemsWrap>
          {position === "admin" ? (
            <React.Fragment>
              {sidebar ? (
                <Styleditemtitles>Maintenance</Styleditemtitles>
              ) : null}
              {SidebarDataMaintenance.map((item, index) => (
                <React.Fragment key={item.title}>
                  <Link to={item.route} style={{ textDecoration: "none" }}>
                    <GridNavItems>
                      <StyledIcons sidebar={sidebar}>{item.icon}</StyledIcons>
                      <StyledListitems sidebar={sidebar}>
                        {item.title}
                      </StyledListitems>
                      {sidebar && item.Submenu ? (
                        <Styledarrow
                          onClick={() => toggleMaintenanceSubmenu(index)}
                        >
                          {item.arrow}
                        </Styledarrow>
                      ) : null}
                    </GridNavItems>
                  </Link>
                  {index === maintenanceSubmenuIndex &&
                    item.Submenu &&
                    item.Submenu.map((data) => (
                      <Link
                        to={data.route}
                        key={data.title}
                        style={{ textDecoration: "none" }}
                      >
                        <GridNavItems style={{ background: "#3b3b3b" }}>
                          <StyledIcons sidebar={sidebar}>
                            {data.icon}
                          </StyledIcons>
                          <StyledListitems sidebar={sidebar}>
                            {data.title}
                          </StyledListitems>
                        </GridNavItems>
                      </Link>
                    ))}
                </React.Fragment>
              ))}
              {sidebar ? <Styleditemtitles>Medical</Styleditemtitles> : null}

              {MedicalSidebarData.map((item, index) => (
                <React.Fragment key={item.title}>
                  <Link to={item.route} style={{ textDecoration: "none" }}>
                    <GridNavItems>
                      <StyledIcons sidebar={sidebar}>{item.icon}</StyledIcons>
                      <StyledListitems sidebar={sidebar}>
                        {item.title}
                      </StyledListitems>
                      {sidebar && (
                        <Styledarrow
                          onClick={() => toggleMedicalSubmenu(index)}
                        >
                          {item.arrow}
                        </Styledarrow>
                      )}
                    </GridNavItems>
                  </Link>
                  {index === medicalSubmenuIndex &&
                    item.Submenu &&
                    item.Submenu.map((data) => (
                      <Link
                        to={data.route}
                        key={data.title}
                        style={{ textDecoration: "none" }}
                      >
                        <GridNavItems style={{ background: "#3b3b3b" }}>
                          <StyledIcons sidebar={sidebar}>
                            {data.icon}
                          </StyledIcons>
                          <StyledListitems sidebar={sidebar}>
                            {data.title}
                          </StyledListitems>
                        </GridNavItems>
                      </Link>
                    ))}
                </React.Fragment>
              ))}
            </React.Fragment>
          ) : null}

          {sidebar ? <Styleditemtitles>Medical</Styleditemtitles> : null}

          {MedicalSidebarDataRestricted.map((item, index) => (
            <React.Fragment key={item.title}>
              <Link to={item.route} style={{ textDecoration: "none" }}>
                <GridNavItems>
                  <StyledIcons sidebar={sidebar}>{item.icon}</StyledIcons>
                  <StyledListitems sidebar={sidebar}>
                    {item.title}
                  </StyledListitems>
                  {sidebar && (
                    <Styledarrow onClick={() => toggleMedicalSubmenu(index)}>
                      {item.arrow}
                    </Styledarrow>
                  )}
                </GridNavItems>
              </Link>
              {index === medicalSubmenuIndex &&
                item.Submenu &&
                item.Submenu.map((data) => (
                  <Link
                    to={data.route}
                    key={data.title}
                    style={{ textDecoration: "none" }}
                  >
                    <GridNavItems style={{ background: "#3b3b3b" }}>
                      <StyledIcons sidebar={sidebar}>{data.icon}</StyledIcons>
                      <StyledListitems sidebar={sidebar}>
                        {data.title}
                      </StyledListitems>
                    </GridNavItems>
                  </Link>
                ))}
            </React.Fragment>
          ))}
        </GridNavItemsWrap>
      </GridNav>
      <GridMain sidebar={sidebar}>{children}</GridMain>
    </Grid>
  );
}

export default Layout;
