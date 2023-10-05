import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import * as FaIcons from "react-icons/fa";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuthWrapper } from "../../Hooks/useAuth";
import { LoginReducer } from "../../Hooks/Reducers";
import { SignIn } from "../../pages/Registration/sign_in";
import { LoginContext } from "../../Helper/userContext";
import axios from "axios";
import Cookies from 'universal-cookie'
import {useCookies} from 'react-cookie'

const Grid = styled.div`
  display: grid;
  grid-template-columns: min-content 1fr min-content;
  align-items: stretch;
  padding: 0 24px;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
  }
  height: 50.32px;

  @media (min-width: 370px) and (max-width: 767px) {
    height: 40.32px;
  }
`;

const StyledHamburger = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 23px;
  cursor: pointer;
  color: white;
  transition: color 0.3s ease;

  &:hover {
    color: #cecece;
    transition: color 0.12s ease-in-out;
  }
`;

const StyledLoginfo = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px;
  color: white;

  @media (min-width: 300px) and (max-width: 450px) {
    display: ${({ sidebar }) => (sidebar ? "none" : "flex")};
  }
`;

const StyledTitle = styled.p`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 19px;
  color: white;
  transition: color 0.3s ease;
  
  &:hover {
    color: #cecece;
  }
  
  @media screen and (min-width: 280px) and (max-width: 500px) {
    display: none;
  }
  `;

const StyledLogout = styled.a`
  cursor: pointer;
  transition: color 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 4px;
  &:hover {
    color: #cecece;
  }
`;

// const { Logout, CheckLogin} = useAuthWrapper();
function Header({ toggle, sidebar }) {

  
  const userSession = useContext(LoginContext);
  const [cookie, setCookie] = useState("");
  const [cookies, removeCookie] = useCookies(['userSession']);
  
  const nav = useNavigate(); 
  
  useEffect(() => {
    const cookies = new Cookies();
    setCookie(cookies.get("userSession"));
  }, []);
  
  const LogoutHandler = () => {
    
    nav("/pages/Registration/sign_in");
    // Remove the cookie
    removeCookie('userSession',{});
    axios
      .delete("http://localhost:3331/users/logout", {
        params: {token: cookie },
      })
      .then((response) => {
        const { loggedIn } = response.data;
        if (loggedIn === false) {
        }
      })
      .catch((error) => {
        // Handle any error that occurs during the request
      });
      location.reload();
    };

    
  return (
    <>
      <Grid>
        <div className="mid">
          <StyledHamburger>
            <FaIcons.FaBars onClick={toggle} />
          </StyledHamburger>
        </div>
        <div>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            {" "}
            <StyledTitle>Air Ocean Maroc</StyledTitle>{" "}
          </Link>
        </div>
        <StyledLoginfo sidebar={sidebar}> 
        <StyledLogout onClick={LogoutHandler}>Logout</StyledLogout>
        </StyledLoginfo>
      </Grid>
    </>
  );
}

export default Header;
