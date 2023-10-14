import styled from "styled-components";
import { useEffect, useState } from "react";
import * as React from "react";
import { Fetch } from "../../Fetch";
import * as FaIcons from "react-icons/fa";
import axios from "axios";
import AsyncSelect from "react-select/async";
import { height } from "@mui/system";

const Selectbox = styled.div`
  padding-top: 5px;
  grid-row: 2;
  grid-column: 1/5;
`;
const Styledselect = styled.select`
  color: #808080;
  border: 1px solid rgba(207, 207, 207, 0.482);
  background-color: #f4f4f446;
  /* border-left: 0px; */
  /* border-radius: 2px; */
  height: 40px;
  max-width: 17em;
  transition: background-color 0.2s ease-in-out;
  transition: box-shadow 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    color: #000000;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
  }
  &:focus {
    outline: none;
  }
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export function OrderList({ pn, product, plane, price, quantity }) {
  const orderlist = [
    {
      pn: pn,
      product: product,
      plane: plane,
      price: price,
      quantity: quantity,
    },
  ];
}

export function DropDownComp({
  title,
  row,
  col,
  options_data,
  route,
  placeholderprop,
}) {
  const [selectedValue, setSelectedValue] = useState(null);

  const dropdownVal = (value) => {
    setSelectedValue(value);
  };

  const data = Fetch({ options_data, route });

  return {
    selectedValue,
    render: (
      <>
        <SelectContainer style={{ gridRow: row, gridColumn: col }}>
          <label
            htmlFor="product"
            style={{ gridRow: row, gridColumn: col, fontSize: "14px" }}
          >
            {title}
          </label>
          <Styledselect
            name="product"
            onChange={(e) => dropdownVal(e.target.value)}
          >
            <option value="" disabled selected>
              {placeholderprop}
            </option>
            {data.map((option, index) => (
              <option key={index} value={option[options_data]}>
                {option[options_data]}
              </option>
            ))}
          </Styledselect>
        </SelectContainer>
      </>
    ),
  };
}

export function DropDownCompStatic({ title, row, col, arr, placeholderprop }) {
  const [selectedValue, setSelectedValue] = useState(null);

  const dropdownVal = (value) => {
    setSelectedValue(value);
  };

  return {
    selectedValue,
    render: (
      <>
        <SelectContainer style={{ gridRow: row, gridColumn: col }}>
          <label htmlFor="product" style={{ fontSize: "14px" }}>
            {title}
          </label>
          <Styledselect
            name="product"
            onChange={(e) => dropdownVal(e.target.value)}
          >
            <option value="" disabled selected>
              {placeholderprop}
            </option>
            {arr.map((data, index) => (
              <option value={data} key={index}>
                {data}
              </option>
            ))}
          </Styledselect>
        </SelectContainer>
      </>
    ),
  };
}

//This is the one that has the async search feature
const StyledAsyncSelect = styled(AsyncSelect)`
  position: absolute;
  width: 100%;
  border-radius: 0px;
`;

export function DynamicaDropDownComp({
  options,
  optionsName,
  ItemId,
  initialVal,
  disabledToF,
}) {
  const [selectedValue, setSelectedValue] = useState(initialVal);

  const filterOptions = (inputValue, optionsName) => {
    return options
      .filter((item) =>
        item[optionsName].toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((item) => ({
        value: item[ItemId],
        label: item[optionsName],
      }));
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedValue(selectedOption);
  };

  return {
    selectedValue,
    render: (
      <>
        <StyledAsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={(inputValue, callback) => {
            setTimeout(() => {
              callback(filterOptions(inputValue, optionsName));
            }, 1000);
          }}
          onChange={handleSelectChange}
          value={selectedValue}
          placeholder={initialVal}
          isDisabled={disabledToF}
          id="AsyncSelect"
        />
      </>
    ),
  };
}

export function FilterDropDownComp({ row, col, arr, placeholderprop }) {
  const [selectedValue, setSelectedValue] = useState(null);

  const dropdownVal = (value) => {
    setSelectedValue(value);
  };

  return {
    selectedValue,
    render: (
      <>
        <SelectContainer
          style={{
            gridRow: row,
            gridColumn: col,
            borderBottomLeftRadius: "0px",
            borderTopLeftRadius: "0px",
            borderRadius: "2px",
            width: "115px",
          }}
        >
          <Styledselect
            name="product"
            onChange={(e) => dropdownVal(e.target.value)}
            style={{}}
          >
            <option value="" disabled selected style={{ color: "#808080" }}>
              Filter By
            </option>
            {arr.map((data, index) => (
              <option value={data} key={index}>
                {data}
              </option>
            ))}
          </Styledselect>
        </SelectContainer>
      </>
    ),
  };
}

export function DropDownStatusChange({
  title,
  row,
  col,
  arr,
  placeholderprop,
}) {
  const [selectedValue, setSelectedValue] = useState(null);

  const dropdownVal = (value) => {
    setSelectedValue(value);
  };

  return {
    selectedValue,
    render: (
      <>
        <SelectContainer
          style={{ gridRow: row, gridColumn: col, height: "27px" }}
        >
          <label htmlFor="product" style={{ fontSize: "12px" }}>
            {title}
          </label>
          <Styledselect
            name="product"
            onChange={(e) => dropdownVal(e.target.value)}
            style={{ background: "#e7e7e74d" }}
          >
            <option value="" disabled selected style={{ color: "#a4a4a4" }}>
              {placeholderprop}
            </option>
            {arr.map((data, index) => (
              <option value={data} key={index} style={{ color: "#a4a4a4" }}>
                {data}
              </option>
            ))}
          </Styledselect>
        </SelectContainer>
      </>
    ),
  };
}

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

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

export function InputComp({ title, row, col, disabled, content }) {
  const [value, setValue] = useState("");

  const changeValue = (e) => {
    setValue(e.target.value);
  };

  return {
    value,
    render: (
      <>
        <TextContainer style={{ gridRow: row, gridColumn: col }}>
          <label
            htmlFor="text"
            style={{ gridRow: row, gridColumn: col, fontSize: "14px" }}
          >
            {title}
          </label>
          <Styledinput
            type="text"
            name="text"
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

const Styledincrementer = styled.input`
  height: 37px;
  width: 100%;
  max-width: 17em;
  border: 0.5px solid #b7b7b7;
  border-radius: 2px;
  transition: background-color 0.2s ease-in-out;
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    color: #000000;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    outline-color: #4884fd;
  }
`;

const IncrementerContainer = styled.div`
width: 100%; `;

export function IncrementerComp({ title, row, col }) {
  const [val, setval] = useState(0);

  const handleChange = (e) => {
    setval(parseInt(e.target.value));
  };

  return {
    val,
    render: (
      <>
        <IncrementerContainer style={{ gridRow: row, gridColumn: col }}>
          <label
            htmlFor="text"
            style={{ gridRow: row, gridColumn: col, fontSize: "14px" }}
          >
            {" "}
            {title}{" "}
          </label>
          <Styledincrementer
            type="number"
            value={val}
            min={0}
            max={10000}
            onChange={handleChange}
          />
        </IncrementerContainer>
      </>
    ),
  };
}

const StyledButton = styled.button`
  background-color: #197bdd;
  color: #ffffff;
  padding: 5px;
  border: 1px solid #f0f0f0;
  border-radius: 5px;
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;
  height: 100%;

  &:hover {
    background-color: #12589d;
    color: #ebebeb;
  }

  &:active {
    background-color: #1d8af6;
    border: 0.3px solid #5a5a5a;
  }
`;

export function ButtonComponent({ type, row, col, onClickFunction }) {
  return (
    <>
      <StyledButton
        style={{ gridRow: row, gridColumn: col }}
        onClick={onClickFunction}
      >
        {type}
      </StyledButton>
    </>
  );
}

const RadioWrapper = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding-top: 18px;
`;

const RadioInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;

  &:checked + span::before {
    content: "";
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #007bff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:focus + span {
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }
`;

const RadioButton = styled.span`
  position: relative;
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #ccc;
`;

const RadioLabel = styled.span`
  margin-left: 8px;
  font-size: 14px;
`;

export function RadioComponent({ label, checked, onChange, row, col }) {
  const [value, setValue] = useState(0);
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return {
    value,
    render: (
      <RadioWrapper
        style={{
          gridRow: row,
          gridColumn: col,
        }}
      >
        <RadioInput
          type="radio"
          checked={checked}
          onChange={onChange}
          value={handleChange}
        />
        <RadioLabel>{label}</RadioLabel>
        <RadioButton />
      </RadioWrapper>
    ),
  };
}

const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 4px;
`;
const StyledDateInput = styled.input`
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

export function DateComponent({ title, row, col }) {
  const [date, setDate] = useState(null);

  const handleChange = (event) => {
    setDate(event.target.value);
  };

  return {
    date,
    render: (
      <>
        <DateContainer>
          <label
            htmlFor="date"
            style={{ gridRow: row, gridColumn: col, fontSize: "14px" }}
          >
            {" "}
            {title}
          </label>
          <StyledDateInput type="date" onChange={handleChange} />
        </DateContainer>
      </>
    ),
  };
}

const StyledExportButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-right: 50px;
  padding-left: 50px;
  border-bottom: 1px solid red;

  background-color: #204cdd;
  color: #ffffff;
  padding: 5px;
  border: none;
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: #2b5dff;
    color: #ebebeb;
  }

  &:active {
    background-color: #2248c5;
    color: #dcdcdc;
  }
`;

const StyledButtonTitle = styled.div`
  padding-right: 10px;
  padding-left: 10px;
`;

export function ExportTable({ title, onClickFunction }) {
  return (
    <>
      <StyledExportButton onClick={onClickFunction}>
        <StyledButtonTitle> {title}</StyledButtonTitle>
        <FaIcons.FaExternalLinkAlt style={{ paddingRight: "10px" }} />
      </StyledExportButton>
    </>
  );
}

export function ChangeOrderStatusButton({ onClickFunction }) {
  return (
    <StyledExportButton onClick={onClickFunction}>
      Apply Changes
    </StyledExportButton>
  );
}

const StyledAddStock = styled.button`
  padding-left: 12px;
  padding-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #808080;
  /* width: 80px; */

  margin-right: 8px;
  border: 1px solid #cfcfcf7b;
  border-radius: 3px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-left: 0px;

  background-color: #f4f4f446;
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    color: black;
    background-color: #f2f2f2c7;
  }

  &:active {
    background-color: #e8e8e8;
  }
`;

export function AddToStock({ portalFunc, onClose }) {
  return (
    <>
      <StyledAddStock
        onClick={() => {
          portalFunc();
        }}
      >
        Add To Stock
        <FaIcons.FaPlus
          style={{ color: "rgb(153, 153, 153)", paddingLeft: "5px" }}
        />
      </StyledAddStock>
    </>
  );
}

const MissionButtonWrap = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;

  margin-left: 8px;
  border: 0px;
  border-radius: 5px;
  /* padding-right: 10px;  */
  background-color: #1d8af6;
  transition: box-shadow 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transition: background-color 0.2s ease-in-out;
    background-color: #007bf7;
    box-shadow: 0 0 5px rgba(0, 98, 255, 0.49);
  }

  &:active {
    background-color: #2d86df;
  }
`;

export function CreateMissionButton({ onClickFunc }) {
  return (
    <>
      <MissionButtonWrap onClick={() => onClickFunc()}>
        <FaIcons.FaPlus
          style={{
            color: "#ffffff",
            padding: "10px",
            paddingLeft: "5px",
            paddingRight: "5px",
          }}
        />
        Create A New Mission
      </MissionButtonWrap>
    </>
  );
}

export function CreateMission({ onClickFunc }) {
  return (
    <>
      <MissionButtonWrap
        onClick={() => onClickFunc()}
        style={{
          padding: "10px",
          width: "100%",
        }}
      >
        Submit Mission
      </MissionButtonWrap>
    </>
  );
}
export function EditMissionStatusButton({ onClickFunc }) {
  return (
    <>
      <MissionButtonWrap
        onClick={() => onClickFunc()}
        style={{
          margin: "0px",
          width: "100%",
          height: "50px",
          fontSize: "15px",
        }}
      >
        Change Status To Complete
      </MissionButtonWrap>
    </>
  );
}

const styledModalTextBoxes = styled.input``;

export function modalTextBoxes({ title }) {
  return <></>;
}

export function AddItemListButton({ onClickFunc }) {
  return (
    <>
      <MissionButtonWrap
        onClick={() => onClickFunc()}
        style={{ backgroundColor: "#d2d2d2" }}
      >
        <FaIcons.FaPlus
          style={{
            color: "#ffffff",
            padding: "10px",
          }}
        />
      </MissionButtonWrap>
    </>
  );
}

const LoginButtonWrap = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  margin-bottom: 50px;

  border: 0px;
  border-radius: 5px;

  background-color: rgb(226 22 23);
  transition: box-shadow 0.2s ease-in-out;
  cursor: pointer;
  
  &:hover {
    transition: background-color 0.2s ease-in-out;
    background-color: #c61100;
  }
  
  &:active {
    background-color: #9b1408;
  }
`;

export function LoginButton({ onClickFunc }) {
  return (
    <>
      <LoginButtonWrap
        onClick={() => onClickFunc()}
        style={{
          width: "60%",
          height: "40px",
          marginTop: "10px",
        }}
      >
        Login
      </LoginButtonWrap>
    </>
  );
}

export function submitButton() {}
