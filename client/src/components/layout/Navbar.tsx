import * as React from "react";
import styled from "styled-components";
import { useState } from "react";
import Header from "./Header";

const StyledNav = styled.nav`
  color: white;
  position: relative;
  display: flex;
  justify-content: center;
  border-bottom: 2px solid red;
  height: 68.32px;

  @media (min-width: 300px) and (max-width: 767px) {
    display: flex;
    height: 68.32px;
    justify-content: center;
    align-items: center;
    font-size: 13.5px;
  }
`;

function NavBar(props) {
  return <StyledNav {...props} />;
}

export default NavBar;
