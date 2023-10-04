import React, { useContext, useEffect, useState, useReducer } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ButtonComponent } from "../../components/content/Input_components";
import { useAuthWrapper } from "../../Hooks/useAuth";

const FullHeightContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Grid = styled.div`
  height: 100vh;
  width: 100vh;
  display: grid;
  grid-template-columns: 0.2fr 7fr 0.2fr;
  grid-template-rows: 1fr 3fr 3fr 1fr;
  gap: 10px;
  overflow: hidden;
`;

const StyledSignInContainer = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-columns: 0.5fr 1fr 0.5fr;
  grid-template-rows: 1fr 3fr 3fr 1fr;
  border: 2px solid #9191916e;
  align-items: center;
  justify-content: center;
  grid-column: 2;
  grid-row: 2/4;
  background: #e3e3e334;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Add shadow here */
`;

const StyledTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  padding-top: 20px;
  margin-top: 10px;
  padding-bottom: 15px;
  border-bottom: 1px solid #9191916e;
  grid-row: 1;
  grid-column: 2;
`;

const StyledHeader = styled.div`
  background: red;
  grid-column: 1/5;
  grid-row: 1;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const Styledinput = styled.input`
  height: 37px;
  width: 100%;
  max-width: 17em;
  border: 0.5px solid #b7b7b7;
  border-radius: 2px;
  transition: background-color 0.2s ease-in-out;
  transition: box-shadow 0.2s ease-in-out;
  cursor: ${({ disabled }) => (disabled ? "" : "pointer")};
  background: ${({ disabled }) => (disabled ? "#eeeeee4d" : "white")};

  &:hover {
    color: #000000;
    box-shadow: ${({ disabled }) =>
      disabled ? "" : "0 0 5px rgba(0, 0, 0, 0.15);"};
  }

  &:focus {
    outline-color: #4884fd;
  }
`;

export function InputCompPass({ title, row, col, disabled, content, }) {
  const [value, setValue] = useState("");

  const changeValue = (e) => {
    setValue(e.target.value);
  };

  return {
    value,
    render: (
      <>
        <TextContainer
          style={{ gridRow: row, gridColumn: col, padding: "3px" }}
        >
          <label
            htmlFor="pass"
            style={{ gridRow: row, gridColumn: col, fontSize: "14px" }}
          >
            {title}
          </label>
          <Styledinput
            type="password"
            name="pass"
            disabled={disabled}
            placeholder={content}
            value={value}
            onChange = {changeValue}
          ></Styledinput>
        </TextContainer>
      </>
    ),
  };
}

export function InputCompEmail({ title, row, col, disabled, content }) {
  const [value, setValue] = useState("");

  const changeValue = (e) => {
    setValue(e.target.value);
  };

  return {
    value,
    render: (
      <>
        <TextContainer
          style={{ gridRow: row, gridColumn: col, padding: "3px" }}
        >
          <label
            htmlFor="email"
            style={{ gridRow: row, gridColumn: col, fontSize: "14px" }}
          >
            {title}
          </label>
          <Styledinput
            type="email"
            name="email"
            disabled={disabled}
            placeholder={content}
            value={value}
            onChange={changeValue}
          ></Styledinput>
        </TextContainer>
      </>
    ),
  };
}

export function SignIn() {


  const {Login,CheckLogin } = useAuthWrapper();

  
  const inputuser = InputCompEmail({
    title: "Email",
    col: 2,
    row: 2,
  });
  
  const inputpass = InputCompPass({
    title: "Password",
    col: 2,
    row: 3,
  });
  
  const handleLogin = () => {
    console.log("Action");
    Login({ email: inputuser.value, pass: inputpass.value });
  };
  
  
  return (
      <FullHeightContainer>
        <Grid>
        </Grid>
      </FullHeightContainer>
  )
  
}

