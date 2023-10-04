import { TextField } from "@mui/material";
import { createContext, useEffect, useState } from "react";
import * as React from "react";
import ReactDOM, { render } from "react-dom";
import * as FaIcons from "react-icons/fa";
import styled from "styled-components";
import {
  AddItemListButton,
  ButtonComponent,
  CreateMission,
  CreateMissionButton,
  DynamicaDropDownComp,
} from "../../components/content/Input_components";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CircularProgress from "@mui/material/CircularProgress";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import dayjs from "dayjs";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import { useField } from "@mui/x-date-pickers/internals";
import { MissionSummaryToggleList } from "../Missions/MissionsLists";

const Wrapper = styled.div`
  background-color: red;
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.561);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: opacity 0.3s ease-in-out;
`;

const ModalContent = styled.div`
  width: 555px;
  border-radius: 7px;
  transition: opacity 0.3s ease-in-out;
  background-image: linear-gradient(to right, #0080ff, #095df0);
`;

const StyledHeading = styled.div`
  display: grid;
  grid-template-columns: 0.1fr 1fr;
  align-items: center;
  grid-column: 1;
  grid-row: 1;
  margin: 20px;
  margin-top: 14px;
  margin-bottom: 14px;
`;

const StyledHeader = styled.p`
  display: flex;
  font-size: 19px;
  margin-top: 0px;
  margin-bottom: 0px;
  margin-left: 0px;
  justify-content: center;
  align-items: center;
  grid-column: 2;
  margin-right: 20px;
  /* padding-left: 88px; */
  color: white;
  font-weight: bold;
`;

const AddGrid = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 50px;
  padding-top: 30px;
  background-color: #ffffff;
`;

const AddContentGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  grid-column: 1/4;
  grid-row: 2;
  align-items: center;
`;

const StyledSuccessMessage = styled.h3`
  padding-right: 40px;
  color: ${(props) => (props.messageColor == "error" ? "red" : "green")};
`;

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

const renderHeader = ({ title, closeFunc, reloadState }) => {
  return (
    <>
      <StyledHeading>
        <FaIcons.FaTimes
          style={{ color: "white", cursor: "pointer", fontSize: "19px" }}
          onClick={() => {
            closeFunc();
            reloadState ? location.reload() : null;
          }}
        />
        <StyledHeader>{title}</StyledHeader>
      </StyledHeading>
    </>
  );
};

export function AddStockModalEXP({ open, onClose }) {
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [date, setDate] = useState(dayjs("2022-04-17"));
  const [loading, setLoading] = useState(false);
  const [openSnackBar, setSnackBar] = useState(false);
  const [errorInserting, setErrorInserting] = useState(false);

  const [renderForm, setRenderForm] = useState(true);
  const [renderCheck, setRenderCheck] = useState(false);
  const [reloadPage, setReloadPage] = useState(false);

  const delayTimeout = () => {
    setTimeout(() => {
      setRenderCheck(false);
      setRenderForm(true);
    }, 2500);
  };

  const SanitizeInputs = (Name, type, Quantity, date) => {
    if (Name.length > 0 && Quantity > 0 && type != null && date != null) {
      return true;
    } else {
      return false;
    }
  };

  const insertStatus = () => {
    return errorInserting ? (
      <>
        <FaIcons.FaExclamation
          style={{
            color: "red",
            fontSize: "40px",
            padding: "80px",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: "15px",
          }}
        />
        <StyledSuccessMessage messageColor={"error"}>
          There Was An Error Inserting {productName}
        </StyledSuccessMessage>
      </>
    ) : (
      <>
        <FaIcons.FaCheck
          style={{
            color: "green",
            fontSize: "40px",
            padding: "80px",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: "15px",
          }}
        />
        <StyledSuccessMessage messageColor={"Success"}>
          {productName} Has Been Added to the Stock
        </StyledSuccessMessage>
      </>
    );
  };

  const handleClose = () => {
    setSnackBar(!openSnackBar);
  };

  const handleSubmit = () => {
    const formattedMonth = (month) => {
      if (month < 10) return "0" + month;
      else return month;
    };

    const formattedDate =
      date.$y + "-" + formattedMonth(date.$M) + "-" + date.$D;

    if (SanitizeInputs(productName, productType, quantity, formattedDate)) {
      setRenderForm(false);
      setLoading(true);

      axios
        .post("http://localhost:3331/Med_stock", {
          data: [
            productType,
            productName,
            formattedDate,
            "",
            "1684438793",
            quantity,
          ],
        })
        .then((suc) => {
          axios
            .post("http://localhost:3331/Med_stock/StockEntries", {
              data: {
                product_name: productName,
                uid: "1684438793",
                quantity: quantity,
                type: "Enter",
              },
            })
            .then((result) => {})
            .catch((e) => {
              setErrorInserting(true);
              console.log(e.message);
              setTimeout(() => {
                setErrorInserting(false);
              }, 5000);
            });
          setReloadPage(true);
          setTimeout(() => {
            setLoading(false);
            setRenderCheck(true);
            delayTimeout();
          }, 1000);
        })
        .catch((e) => {
          setErrorInserting(true);
          alert(e.data.message);
        });
    } else {
      alert("Please Enter The Fields Correctly");
    }
  };

  if (!open) return null;
  return ReactDOM.createPortal(
    <ModalWrapper>
      <ModalContent>
        {loading ? (
          <>
            {renderHeader({
              title: "Add To Stock",
              closeFunc: onClose,
              reloadState: reloadPage,
            })}
            <AddGrid>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "80px",
                }}
              >
                <CircularProgress value={loading} />
              </Box>
            </AddGrid>
          </>
        ) : (
          <>
            {renderForm && (
              <>
                {renderHeader({
                  title: "Add To Stock",
                  closeFunc: onClose,
                  reloadState: reloadPage,
                })}
                <AddGrid>
                  <AddContentGrid
                    style={{ gridTemplateRows: "1fr 1fr 1fr", width: "300px" }}
                  >
                    <TextField
                      label="Product Name"
                      variant="standard"
                      fullWidth={true}
                      onChange={(e) => {
                        setProductName(e.target.value);
                      }}
                    />
                    <FormControl
                      variant="standard"
                      sx={{ m: 1, minWidth: 120 }}
                      fullWidth={true}
                    >
                      <InputLabel>Product Type</InputLabel>
                      <Select
                        value={productType}
                        onChange={(e) => {
                          setProductType(e.target.value);
                        }}
                        label="Age"
                        fullWidth={true}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {optionValues.map((value) => (
                          <MenuItem value={value} key={value}>
                            {value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label="Quantity"
                      variant="standard"
                      fullWidth={true}
                      type={"number"}
                      onChange={(e) => {
                        setQuantity(e.target.value);
                      }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Expiry Date"
                        value={date}
                        onChange={(newValue) => setDate(newValue)}
                        sx={{ width: "100%", marginTop: "19px" }}
                      />
                    </LocalizationProvider>
                    <Button
                      variant="contained"
                      fullWidth={true}
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      submit
                    </Button>
                  </AddContentGrid>
                </AddGrid>
              </>
            )}
            {renderCheck && (
              <>
                {renderHeader({
                  title: "Add To Stock",
                  closeFunc: onClose,
                  reloadState: reloadPage,
                })}
                <AddGrid>{insertStatus()}</AddGrid>
              </>
            )}
          </>
        )}
      </ModalContent>
    </ModalWrapper>,
    document.getElementById("portal")
  );
}

export function AddMaintenanceStockModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [openSnackBar, setSnackBar] = useState(false);
  const [errorInserting, setErrorInserting] = useState(false);
  const [planeList, setPlaneList] = useState([{}]);

  const [renderForm, setRenderForm] = useState(true);
  const [renderCheck, setRenderCheck] = useState(false);
  const [reloadPage, setReloadPage] = useState(false);
  const [values, setValues] = useState({
    pn: "",
    productName: "",
    productType: "",
    plane: "",
    price: null,
    quantity: null,
  });

  //Dynamically retrieve each plane.
  useEffect(() => {
    axios.get("http://localhost:3331/planes/getName").then((result) => {
      setPlaneList(result.data);
    });
  }, []);

  const productTypes = [
    "Piece Avion",
    "Produit Consommable",
    "Produit Outillage",
    "Matériel de Servitude",
  ];

  const delayTimeout = () => {
    setTimeout(() => {
      setRenderCheck(false);
      setRenderForm(true);
    }, 2500);
  };

  const SanitizeInputs = (productType, pn, price, quantity) => {
    if (price && quantity && pn && productType.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  const insertStatus = () => {
    return errorInserting ? (
      <>
        <FaIcons.FaExclamation
          style={{
            color: "red",
            fontSize: "40px",
            padding: "80px",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: "15px",
          }}
        />
        <StyledSuccessMessage messageColor={"error"}>
          There Was An Error Inserting {values.productName}
        </StyledSuccessMessage>
      </>
    ) : (
      <>
        <FaIcons.FaCheck
          style={{
            color: "green",
            fontSize: "40px",
            padding: "80px",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: "15px",
          }}
        />
        <StyledSuccessMessage messageColor={"Success"}>
          {values.productName} Has Been Added to the Stock
        </StyledSuccessMessage>
      </>
    );
  };

  const handleClose = () => {
    setSnackBar(!openSnackBar);
  };

  const handleSubmit = () => {
    const formattedMonth = (month) => {
      if (month < 10) return "0" + month;
      else return month;
    };

    if (
      SanitizeInputs(
        values.productType,
        values.pn,
        values.price,
        values.quantity
      )
    ) {
      setRenderForm(false);
      setLoading(true);

      axios
        .post("http://localhost:3331/Maintanance_stock", {
          data: [
            values.pn,
            values.productName,
            values.productType,
            values.plane,
            values.price,
            values.quantity,
          ],
        })
        .then((suc) => {
          setReloadPage(true);
          setTimeout(() => {
            setLoading(false);
            setRenderCheck(true);
            delayTimeout();
          }, 1000);
        })
        .catch((e) => {
          setErrorInserting(true);
          setTimeout(() => {
            setErrorInserting(false);
          }, 5000);
          setErrorInserting(true);
        });
    } else {
      alert("Please Enter The Fields Correctly");
    }
  };

  if (!open) return null;
  return ReactDOM.createPortal(
    <ModalWrapper>
      <ModalContent>
        {loading ? (
          <>
            {renderHeader({
              title: "Add To Stock",
              closeFunc: onClose,
              reloadState: reloadPage,
            })}
            <AddGrid>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "80px",
                }}
              >
                <CircularProgress value={loading} />
              </Box>
            </AddGrid>
          </>
        ) : (
          <>
            {renderForm && (
              <>
                {renderHeader({
                  title: "Add To Stock",
                  closeFunc: onClose,
                  reloadState: reloadPage,
                })}
                <AddGrid>
                  <AddContentGrid
                    style={{ gridTemplateRows: "1fr 1fr 1fr", width: "300px" }}
                  >
                    <TextField
                      label="Product Name"
                      variant="standard"
                      fullWidth={true}
                      onChange={(e) => {
                        // Spread operator used to keep the previous values in the object the same.
                        setValues({ ...values, productName: e.target.value });
                      }}
                    />
                    <FormControl
                      variant="standard"
                      sx={{ m: 1, minWidth: 120 }}
                      fullWidth={true}
                    >
                      <InputLabel>Product Type</InputLabel>
                      <Select
                        id="productType"
                        value={values.productType}
                        onChange={(e) => {
                          setValues({ ...values, productType: e.target.value });
                        }}
                        label="Age"
                        fullWidth={true}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {productTypes.map((value) => (
                          <MenuItem value={value} key={value}>
                            {value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      variant="standard"
                      sx={{ m: 1, minWidth: 120 }}
                      fullWidth={true}
                    >
                      <InputLabel>Plane</InputLabel>
                      <Select
                        id="productType"
                        value={values.plane}
                        onChange={(e) => {
                          setValues({ ...values, plane: e.target.value });
                        }}
                        label="Age"
                        fullWidth={true}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {planeList.map((value, index) => (
                          <MenuItem value={value.call_sign} key={index}>
                            {value.call_sign}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      id="pn"
                      label="P/N"
                      variant="standard"
                      fullWidth={true}
                      onChange={(e) => {
                        setValues({ ...values, pn: e.target.value });
                      }}
                    />
                    <TextField
                      id="Quantity"
                      label="Quantity"
                      variant="standard"
                      fullWidth={true}
                      type={"number"}
                      onChange={(e) => {
                        setValues({ ...values, quantity: e.target.value });
                      }}
                    />
                    <TextField
                      id="Price"
                      label="Price"
                      variant="standard"
                      fullWidth={true}
                      type={"number"}
                      onChange={(e) => {
                        setValues({ ...values, price: e.target.value });
                      }}
                    />
                    <Button
                      variant="contained"
                      fullWidth={true}
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      submit
                    </Button>
                  </AddContentGrid>
                </AddGrid>
              </>
            )}
            {renderCheck && (
              <>
                {renderHeader({
                  title: "Add To Stock",
                  closeFunc: onClose,
                  reloadState: reloadPage,
                })}
                <AddGrid>{insertStatus()}</AddGrid>
              </>
            )}
          </>
        )}
      </ModalContent>
    </ModalWrapper>,
    document.getElementById("portal")
  );
}

export function AddMedicalEquipmentStockModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [openSnackBar, setSnackBar] = useState(false);
  const [errorInserting, setErrorInserting] = useState(false);
  const [date, setDate] = useState(dayjs("2022-04-17"));

  const [renderForm, setRenderForm] = useState(true);
  const [renderCheck, setRenderCheck] = useState(false);
  const [reloadPage, setReloadPage] = useState(false);
  const [values, setValues] = useState({
    productName: "",
    quantity: 0,
    location: "",
  });

  const delayTimeout = () => {
    setTimeout(() => {
      setRenderCheck(false);
      setRenderForm(true);
    }, 2500);
  };

  const SanitizeInputs = (name, quantity, location, date) => {
    if (name && location && date != " " && quantity > 0) {
      return true;
    } else {
      return false;
    }
  };
  const insertStatus = () => {
    return errorInserting ? (
      <>
        <FaIcons.FaExclamation
          style={{
            color: "red",
            fontSize: "40px",
            padding: "80px",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: "15px",
          }}
        />
        <StyledSuccessMessage messageColor={"error"}>
          There Was An Error Inserting {values.productName}
        </StyledSuccessMessage>
      </>
    ) : (
      <>
        <FaIcons.FaCheck
          style={{
            color: "green",
            fontSize: "40px",
            padding: "80px",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: "15px",
          }}
        />
        <StyledSuccessMessage messageColor={"Success"}>
          {values.productName} Has Been Added to the Stock
        </StyledSuccessMessage>
      </>
    );
  };

  const handleClose = () => {
    setSnackBar(!openSnackBar);
  };

  const handleSubmit = () => {
    const formattedMonth = (month) => {
      if (month < 10) return "0" + month;
      else return month;
    };

    const formattedDate =
      date.$y + "-" + formattedMonth(date.$M) + "-" + date.$D;

    console.log(formattedDate);
    if (
      SanitizeInputs(values.productName, values.quantity, values.location, date)
    ) {
      setRenderForm(false);
      setLoading(true);
      axios
        .post("http://localhost:3331/MedicalEquipmentStock/AddItems", {
          data: [
            values.productName,
            values.quantity,
            formattedDate,
            values.location,
          ],
        })
        .then((suc) => {
          setReloadPage(true);
          setTimeout(() => {
            setLoading(false);
            setRenderCheck(true);
            delayTimeout();
          }, 1000);
        })
        .catch((e) => {
          setErrorInserting(true);
          setTimeout(() => {
            setErrorInserting(false);
          }, 5000);
          setErrorInserting(true);
        });
    } else {
      alert("Please Enter The Fields Correctly");
    }
  };

  if (!open) return null;
  return ReactDOM.createPortal(
    <ModalWrapper>
      <ModalContent>
        {loading ? (
          <>
            {renderHeader({
              title: "Add To Stock",
              closeFunc: onClose,
              reloadState: reloadPage,
            })}
            <AddGrid>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "80px",
                }}
              >
                <CircularProgress value={loading} />
              </Box>
            </AddGrid>
          </>
        ) : (
          <>
            {renderForm && (
              <>
                {renderHeader({
                  title: "Add To Stock",
                  closeFunc: onClose,
                  reloadState: reloadPage,
                })}
                <AddGrid>
                  <AddContentGrid
                    style={{ gridTemplateRows: "1fr 1fr 1fr", width: "300px" }}
                  >
                    <TextField
                      label="Product Name"
                      variant="standard"
                      fullWidth={true}
                      onChange={(e) => {
                        setValues({ ...values, productName: e.target.value });
                      }}
                    />
                    <TextField
                      id="Quantity"
                      label="Quantity"
                      variant="standard"
                      fullWidth={true}
                      type={"number"}
                      onChange={(e) => {
                        setValues({ ...values, quantity: e.target.value });
                      }}
                    />
                    <TextField
                      id="Location"
                      label="Location"
                      variant="standard"
                      fullWidth={true}
                      type={"text"}
                      onChange={(e) => {
                        setValues({ ...values, location: e.target.value });
                      }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date Of Inspection"
                        value={date}
                        onChange={(newValue) => setDate(newValue)}
                        sx={{ width: "100%", marginTop: "19px" }}
                      />
                    </LocalizationProvider>
                    <Button
                      variant="contained"
                      fullWidth={true}
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      submit
                    </Button>
                  </AddContentGrid>
                </AddGrid>
              </>
            )}
            {renderCheck && (
              <>
                {renderHeader({
                  title: "Add To Stock",
                  closeFunc: onClose,
                  reloadState: reloadPage,
                })}
                <AddGrid>{insertStatus()}</AddGrid>
              </>
            )}
          </>
        )}
      </ModalContent>
    </ModalWrapper>,
    document.getElementById("portal")
  );
}

export function AddPlane({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [openSnackBar, setSnackBar] = useState(false);
  const [errorInserting, setErrorInserting] = useState(false);
  const [renderForm, setRenderForm] = useState(true);
  const [renderCheck, setRenderCheck] = useState(false);
  const [reloadPage, setReloadPage] = useState(false);

  const [values, setValues] = useState({
    callSign: "",
    company: "",
    model: "",
    year: null,
  });

  const delayTimeout = () => {
    setTimeout(() => {
      setRenderCheck(false);
      setRenderForm(true);
    }, 2500);
  };

  const SanitizeInputs = (callSign, Year, Model, Company) => {
    if (
      callSign.length > 0 &&
      Year > 0 &&
      Model.length > 0 &&
      Company.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  const insertStatus = () => {
    return errorInserting ? (
      <>
        <FaIcons.FaExclamation
          style={{
            color: "red",
            fontSize: "40px",
            padding: "80px",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: "15px",
          }}
        />
        <StyledSuccessMessage messageColor={"error"}>
          There Was An Error Inserting {values.callSign}
        </StyledSuccessMessage>
      </>
    ) : (
      <>
        <FaIcons.FaCheck
          style={{
            color: "green",
            fontSize: "40px",
            padding: "80px",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: "15px",
          }}
        />
        <StyledSuccessMessage messageColor={"Success"}>
          {values.callSign} Has Been Added
        </StyledSuccessMessage>
      </>
    );
  };

  const handleClose = () => {
    setSnackBar(!openSnackBar);
  };

  const handleSubmit = () => {
    const formattedMonth = (month) => {
      if (month < 10) return "0" + month;
      else return month;
    };

    if (
      SanitizeInputs(values.callSign, values.year, values.model, values.company)
    ) {
      setRenderForm(false);
      setLoading(true);

      axios
        .post("http://localhost:3331/planes/Add", {
          data: [values.callSign, values.company, values.model, values.year],
        })
        .then((suc) => {
          setReloadPage(true);
          setTimeout(() => {
            setLoading(false);
            setRenderCheck(true);
            delayTimeout();
          }, 1000);
        })
        .catch((e) => {
          setErrorInserting(true);
          setTimeout(() => {
            setErrorInserting(false);
          }, 5000);
          setErrorInserting(true);
        });
    } else {
      alert("Please Enter The Fields Correctly");
    }
  };

  if (!open) return null;
  return ReactDOM.createPortal(
    <ModalWrapper>
      <ModalContent>
        {loading ? (
          <>
            {renderHeader({
              title: "Add A Plane",
              closeFunc: onClose,
              reloadState: reloadPage,
            })}
            <AddGrid>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "80px",
                }}
              >
                <CircularProgress value={loading} />
              </Box>
            </AddGrid>
          </>
        ) : (
          <>
            {renderForm && (
              <>
                {renderHeader({
                  title: "Add A Plane",
                  closeFunc: onClose,
                  reloadState: reloadPage,
                })}
                <AddGrid>
                  <AddContentGrid
                    style={{ gridTemplateRows: "1fr 1fr 1fr", width: "300px" }}
                  >
                    <TextField
                      label="Call Sign"
                      variant="standard"
                      fullWidth={true}
                      onChange={(e) => {
                        // Spread operator used to keep the previous values in the object the same.
                        setValues({ ...values, callSign: e.target.value });
                      }}
                    />
                    <TextField
                      id="Company"
                      label="Company"
                      variant="standard"
                      fullWidth={true}
                      onChange={(e) => {
                        setValues({ ...values, company: e.target.value });
                      }}
                    />
                    <TextField
                      id="Model"
                      label="Model"
                      variant="standard"
                      fullWidth={true}
                      onChange={(e) => {
                        setValues({ ...values, model: e.target.value });
                      }}
                    />
                    <TextField
                      id="Year"
                      label="Year"
                      variant="standard"
                      fullWidth={true}
                      type={"number"}
                      onChange={(e) => {
                        setValues({ ...values, year: e.target.value });
                      }}
                    />
                    <Button
                      variant="contained"
                      fullWidth={true}
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      submit
                    </Button>
                  </AddContentGrid>
                </AddGrid>
              </>
            )}
            {renderCheck && (
              <>
                {renderHeader({
                  title: "Add A Plane",
                  closeFunc: onClose,
                  reloadState: reloadPage,
                })}
                <AddGrid>{insertStatus()}</AddGrid>
              </>
            )}
          </>
        )}
      </ModalContent>
    </ModalWrapper>,
    document.getElementById("portal")
  );
}

export function AddSupplier({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [openSnackBar, setSnackBar] = useState(false);
  const [errorInserting, setErrorInserting] = useState(false);
  const [renderForm, setRenderForm] = useState(true);
  const [renderCheck, setRenderCheck] = useState(false);
  const [reloadPage, setReloadPage] = useState(false);

  const [values, setValues] = useState({
    supplierName: "",
    country: "",
    email: "",
    address: null,
    phoneNumber: null,
  });

  const delayTimeout = () => {
    setTimeout(() => {
      setRenderCheck(false);
      setRenderForm(true);
    }, 2500);
  };

  const SanitizeInputs = (name, country, email, address) => {
    if (name.length && country.length && email.length && address.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const insertStatus = () => {
    return errorInserting ? (
      <>
        <FaIcons.FaExclamation
          style={{
            color: "red",
            fontSize: "40px",
            padding: "80px",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: "15px",
          }}
        />
        <StyledSuccessMessage messageColor={"error"}>
          {values.supplierName} Could Not Be Added
        </StyledSuccessMessage>
      </>
    ) : (
      <>
        <FaIcons.FaCheck
          style={{
            color: "green",
            fontSize: "40px",
            padding: "80px",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: "15px",
          }}
        />
        <StyledSuccessMessage messageColor={"Success"}>
          {values.supplierName} has been added.
        </StyledSuccessMessage>
      </>
    );
  };

  const handleClose = () => {
    setSnackBar(!openSnackBar);
  };

  const handleSubmit = () => {
    const formattedMonth = (month) => {
      if (month < 10) return "0" + month;
      else return month;
    };

    if (
      SanitizeInputs(
        values.supplierName,
        values.country,
        values.email,
        values.address
      )
    ) {
      setRenderForm(false);
      setLoading(true);

      axios
        .post("http://localhost:3331/Supplier", {
          data: [
            values.supplierName,
            values.country,
            values.email,
            values.address,
            values.phoneNumber,
          ],
        })
        .then((suc) => {
          setReloadPage(true);
          setTimeout(() => {
            setLoading(false);
            setRenderCheck(true);
            delayTimeout();
          }, 1000);
        })
        .catch((e) => {
          setErrorInserting(true);
          setTimeout(() => {
            setErrorInserting(false);
          }, 5000);
          setErrorInserting(true);
        });
    } else {
      alert("Please Enter The Fields Correctly");
    }
  };

  if (!open) return null;
  return ReactDOM.createPortal(
    <ModalWrapper>
      <ModalContent>
        {loading ? (
          <>
            {renderHeader({
              title: "Add A Supplier",
              closeFunc: onClose,
              reloadState: reloadPage,
            })}
            <AddGrid>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "80px",
                }}
              >
                <CircularProgress value={loading} />
              </Box>
            </AddGrid>
          </>
        ) : (
          <>
            {renderForm && (
              <>
                {renderHeader({
                  title: "Add A Supplier",
                  closeFunc: onClose,
                  reloadState: reloadPage,
                })}
                <AddGrid>
                  <AddContentGrid
                    style={{ gridTemplateRows: "1fr 1fr 1fr", width: "300px" }}
                  >
                    <TextField
                      label="Supplier Name"
                      variant="standard"
                      fullWidth={true}
                      onChange={(e) => {
                        // Spread operator used to keep the previous values in the object the same.
                        setValues({ ...values, supplierName: e.target.value });
                      }}
                    />
                    <TextField
                      id="Country"
                      label="Country"
                      variant="standard"
                      fullWidth={true}
                      onChange={(e) => {
                        setValues({ ...values, country: e.target.value });
                      }}
                    />
                    <TextField
                      id="email"
                      label="Email"
                      variant="standard"
                      fullWidth={true}
                      onChange={(e) => {
                        setValues({ ...values, email: e.target.value });
                      }}
                    />
                    <TextField
                      id="Address"
                      label="Address"
                      variant="standard"
                      fullWidth={true}
                      onChange={(e) => {
                        setValues({ ...values, address: e.target.value });
                      }}
                    />
                    <TextField
                      id="phoneNumber"
                      label="Phone Number"
                      variant="standard"
                      fullWidth={true}
                      type={"number"}
                      onChange={(e) => {
                        setValues({ ...values, phoneNumber: e.target.value });
                      }}
                    />
                    <Button
                      variant="contained"
                      fullWidth={true}
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      submit
                    </Button>
                  </AddContentGrid>
                </AddGrid>
              </>
            )}
            {renderCheck && (
              <>
                {renderHeader({
                  title: "Add A Supplier",
                  closeFunc: onClose,
                  reloadState: reloadPage,
                })}
                <AddGrid>{insertStatus()}</AddGrid>
              </>
            )}
          </>
        )}
      </ModalContent>
    </ModalWrapper>,
    document.getElementById("portal")
  );
}

export function EditDrugModal({ open, onClose, data }) {
  const [loading, setLoading] = useState(false);
  const [openSnackBar, setSnackBar] = useState(false);
  const [errorInserting, setErrorInserting] = useState(false);
  const [renderForm, setRenderForm] = useState(true);
  const [renderCheck, setRenderCheck] = useState(false);
  const [reloadPage, setReloadPage] = useState(false);

  const [values, setValues] = useState({
    type: "",
    quantity: 0,
    flightNo: null,
  });

  const delayTimeout = () => {
    setTimeout(() => {
      setRenderCheck(false);
      setRenderForm(true);
    }, 2500);
  };

  const SanitizeInputs = (name, country, email, address) => {
    if (name.length && country.length && email.length && address.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const insertStatus = () => {
    return errorInserting ? (
      <>
        <FaIcons.FaExclamation
          style={{
            color: "red",
            fontSize: "40px",
            padding: "80px",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: "15px",
          }}
        />
        <StyledSuccessMessage messageColor={"error"}>
          {data.Product_name} Could Not Be Updated
        </StyledSuccessMessage>
      </>
    ) : (
      <>
        <FaIcons.FaCheck
          style={{
            color: "green",
            fontSize: "40px",
            padding: "80px",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: "15px",
          }}
        />
        <StyledSuccessMessage messageColor={"Success"}>
          {data.Product_name} has been updated.
        </StyledSuccessMessage>
      </>
    );
  };

  const handleClose = () => {
    setSnackBar(!openSnackBar);
  };

  function handleSubmit() {
    if (values.type == "Remove") {
      if (data.Quantity < values.quantity) {
        alert("Please Enter a valid removal quantity");
      } else {
        setRenderForm(false);
        setLoading(true);
        axios
          .put("http://localhost:3331/Med_stock/StockRemoval", {
            currentQty: data.Quantity,
            RemovalQty: values.quantity,
            productName: data.Product_name,
            productID: data.Product_ID,
          })
          .then((result) => {
            //This route is to keep track of the entry and exits of each Drugs for any given mission.
            axios
              .post("http://localhost:3331/Med_stock/UpdateEvent", {
                data: [
                  data.Product_ID,
                  data.uid,
                  values.quantity,
                  values.flightNo,
                  values.type,
                ],
              })
              .then((result) => {
                setReloadPage(true);
                setTimeout(() => {
                  setLoading(false);
                  setRenderCheck(true);
                  delayTimeout();
                }, 1000);
              })
              .catch((e) => {
                setErrorInserting(true);
                setTimeout(() => {
                  setErrorInserting(false);
                }, 5000);
                setErrorInserting(true);
              });
          });
      }
    } else {
      setRenderForm(false);
      setLoading(true);
      axios
        .put("http://localhost:3331/Med_stock/StockUpdate", {
          currentQty: data.Quantity,
          RemovalQty: values.quantity,
          productName: data.Product_name,
          productID: data.Product_ID,
        })
        .then((result) => {
          //This route is to keep track of the entry and exits of each Drugs for any given mission.
          axios
            .post("http://localhost:3331/Med_stock/UpdateEvent", {
              data: [
                data.Product_ID,
                data.uid,
                values.quantity,
                values.flightNo,
                values.type,
              ],
            })
            .then((result) => {
              setReloadPage(true);
              setTimeout(() => {
                setLoading(false);
                setRenderCheck(true);
                delayTimeout();
              }, 1000);
            })
            .catch((e) => {
              setErrorInserting(true);
              setTimeout(() => {
                setErrorInserting(false);
              }, 5000);
              setErrorInserting(true);
            });
        });
    }
  }

  if (!open) return null;
  return ReactDOM.createPortal(
    <ModalWrapper>
      <ModalContent>
        {loading ? (
          <>
            {renderHeader({
              title: `Edit ${data.Product_name}`,
              closeFunc: onClose,
              reloadState: reloadPage,
            })}
            <AddGrid>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "80px",
                }}
              >
                <CircularProgress value={loading} />
              </Box>
            </AddGrid>
          </>
        ) : (
          <>
            {renderForm && (
              <>
                {renderHeader({
                  title: `Edit ${data.Product_name}`,
                  closeFunc: onClose,
                  reloadState: reloadPage,
                })}
                <AddGrid>
                  <AddContentGrid
                    style={{ gridTemplateRows: "1fr 1fr 1fr", width: "300px" }}
                  >
                    <FormControl
                      variant="standard"
                      sx={{ m: 1, minWidth: 120 }}
                      fullWidth={true}
                    >
                      <InputLabel>Update Type</InputLabel>
                      <Select
                        id="updateType"
                        value={values.productType}
                        onChange={(e) => {
                          setValues({ ...values, type: e.target.value });
                        }}
                        label="Age"
                        fullWidth={true}
                      >
                        {["Remove", "Enter"].map((value) => (
                          <MenuItem value={value} key={value}>
                            {value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {values.type == "Remove" ? (
                      <TextField
                        id="flightNo"
                        label="Flight NO"
                        variant="standard"
                        fullWidth={true}
                        onChange={(e) => {
                          setValues({ ...values, flightNo: e.target.value });
                        }}
                      />
                    ) : null}

                    <TextField
                      id="quantity"
                      label="Quantity"
                      variant="standard"
                      fullWidth={true}
                      type={"number"}
                      onChange={(e) => {
                        setValues({ ...values, quantity: e.target.value });
                      }}
                    />
                    <Button
                      variant="contained"
                      fullWidth={true}
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      submit
                    </Button>
                  </AddContentGrid>
                </AddGrid>
              </>
            )}
            {renderCheck && (
              <>
                {renderHeader({
                  title: `Edit ${data.Product_name}`,
                  closeFunc: onClose,
                  reloadState: reloadPage,
                })}
                <AddGrid>{insertStatus()}</AddGrid>
              </>
            )}
          </>
        )}
      </ModalContent>
    </ModalWrapper>,
    document.getElementById("portal")
  );
}

export function EditOrderModal({ open, onClose, data, route, orderId }) {
  const [loading, setLoading] = useState(false);
  const [openSnackBar, setSnackBar] = useState(false);
  const [errorInserting, setErrorInserting] = useState(false);
  const [renderForm, setRenderForm] = useState(true);
  const [renderCheck, setRenderCheck] = useState(false);
  const [reloadPage, setReloadPage] = useState(false);

  const [values, setValues] = useState({
    type: "",
    value: 0,
  });

  const delayTimeout = () => {
    setTimeout(() => {
      setRenderCheck(false);
      setRenderForm(true);
    }, 2500);
  };

  const SanitizeInputs = (type, value) => {
    if (type != " " && value > 0) {
      return true;
    } else {
      return false;
    }
  };

  const insertStatus = () => {
    return errorInserting ? (
      <>
        <FaIcons.FaExclamation
          style={{
            color: "red",
            fontSize: "40px",
            padding: "80px",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: "15px",
          }}
        />
        <StyledSuccessMessage messageColor={"error"}>
          {data.product_name} Could Not Be Updated
        </StyledSuccessMessage>
      </>
    ) : (
      <>
        <FaIcons.FaCheck
          style={{
            color: "green",
            fontSize: "40px",
            padding: "80px",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: "15px",
          }}
        />
        <StyledSuccessMessage messageColor={"Success"}>
          {data.product_name} has been updated.
        </StyledSuccessMessage>
      </>
    );
  };

  const handleClose = () => {
    setSnackBar(!openSnackBar);
  };

  function handleSubmit() {
    if (SanitizeInputs(values.type, values.value)) {
      setRenderForm(false);
      setLoading(true);
      axios
        .put(`http://localhost:3331/Orders/${route}/${orderId}`, {
          type: values.type,
          value: values.value,
        })
        .then((result) => {
          setReloadPage(true);
          setTimeout(() => {
            setLoading(false);
            setRenderCheck(true);
            delayTimeout();
          }, 1000);
        })
        .catch((e) => {
          setErrorInserting(true);
          setTimeout(() => {
            setErrorInserting(false);
          }, 5000);
          setErrorInserting(true);
        });
    } else {
      alert("Please Complete The Fields");
    }
  }

  if (!open) return null;
  return ReactDOM.createPortal(
    <ModalWrapper>
      <ModalContent>
        {loading ? (
          <>
            {renderHeader({
              title: `Edit ${data.product_name}`,
              closeFunc: onClose,
              reloadState: reloadPage,
            })}
            <AddGrid>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "80px",
                }}
              >
                <CircularProgress value={loading} />
              </Box>
            </AddGrid>
          </>
        ) : (
          <>
            {renderForm && (
              <>
                {renderHeader({
                  title: `Edit ${data.product_name}`,
                  closeFunc: onClose,
                  reloadState: reloadPage,
                })}
                <AddGrid>
                  <AddContentGrid
                    style={{ gridTemplateRows: "1fr 1fr 1fr", width: "300px" }}
                  >
                    <FormControl
                      variant="standard"
                      sx={{ m: 1, minWidth: 120 }}
                      fullWidth={true}
                    >
                      <InputLabel>Update Type</InputLabel>
                      <Select
                        id="updateType"
                        value={values.type}
                        onChange={(e) => {
                          setValues({ ...values, type: e.target.value });
                        }}
                        label="Age"
                        fullWidth={true}
                      >
                        {route === "EditPartOrder"
                          ? ["price", "quantity"].map((value) => (
                              <MenuItem value={value} key={value}>
                                {value}
                              </MenuItem>
                            ))
                          : ["quantity"].map((value) => (
                              <MenuItem value={value} key={value}>
                                {value}
                              </MenuItem>
                            ))}
                      </Select>
                    </FormControl>
                    {values.type == "quantity" ? (
                      <TextField
                        id="Quantity"
                        label="Quantity"
                        variant="standard"
                        fullWidth={true}
                        type={"number"}
                        onChange={(e) => {
                          setValues({ ...values, value: e.target.value });
                        }}
                      />
                    ) : values.type == "" ? null : (
                      <TextField
                        id="price"
                        label="Price"
                        variant="standard"
                        fullWidth={true}
                        type={"number"}
                        onChange={(e) => {
                          setValues({ ...values, value: e.target.value });
                        }}
                      />
                    )}
                    <Button
                      variant="contained"
                      fullWidth={true}
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      submit
                    </Button>
                  </AddContentGrid>
                </AddGrid>
              </>
            )}
            {renderCheck && (
              <>
                {renderHeader({
                  title: `Edit ${data.product_name}`,
                  closeFunc: onClose,
                  reloadState: reloadPage,
                })}
                <AddGrid>{insertStatus()}</AddGrid>
              </>
            )}
          </>
        )}
      </ModalContent>
    </ModalWrapper>,
    document.getElementById("portal")
  );
}

const StyledProgressBarWrapper = styled.ul`
  list-style: none;
  padding-right: 33px;
`;

const StyledProgressItems = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: #565656;
  padding: 20px;
  margin-top: 14px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    transition: background-color 0.2s ease-in-out;
    background-color: #646464;
  }
`;

const StyledButtonsWrapper = styled.div`
  display: flex;
  border-bottom-left-radius: 7px;
  border-bottom-right-radius: 7px;
  padding: 10px;
  background-color: white;
  justify-content: space-between;
`;

const StyledForthButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.position == 4 ? "#666666" : "#1d8af6")};
  color: white;
  border-radius: 30px;
  cursor: ${(props) => (props.position == 4 ? null : "pointer")};

  &:hover {
    transition: background-color 0.2s ease-in-out;
    background-color: ${(props) =>
      props.position == 4 ? "#666666" : "#007bf7"};
    box-shadow: ${(props) =>
      props.position == 4 ? null : "0 0 5px rgba(0, 98, 255, 0.49)"};
  }

  &:active {
    background-color: ${(props) =>
      props.position == 4 ? "#666666" : "#2d86df"};
  }
`;

const StyledBackButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.position == 0 ? "#666666" : "#1d8af6")};
  color: white;
  border-radius: 30px;
  cursor: ${(props) => (props.position == 0 ? null : "pointer")};

  &:hover {
    transition: background-color 0.2s ease-in-out;
    background-color: ${(props) =>
      props.position == 0 ? "#666666" : "#007bf7"};
    box-shadow: ${(props) =>
      props.position == 0 ? null : "0 0 5px rgba(0, 98, 255, 0.49)"};
  }

  &:active {
    background-color: ${(props) =>
      props.position == 0 ? "#666666" : "#2d86df"};
  }
`;

const Styledline = styled.div`
  background-color: #383838;
  height: 300px;
  top: 30%;
  width: 30px;
  left: 29.7%;
  /* border: 1px solid red;  */
  position: fixed;
  z-index: -1;
`;

const renderMissionsHeader = ({ title, closeFunc, reloadState }) => {
  return (
    <>
      <StyledHeading>
        <FaIcons.FaTimes
          style={{ color: "white", cursor: "pointer", fontSize: "19px" }}
          onClick={() => {
            closeFunc();
            reloadState ? location.reload() : null;
          }}
        />
        <StyledHeader>{title}</StyledHeader>
      </StyledHeading>
    </>
  );
};

const missionDataContext = createContext({
  missionState: {
    personele: [],
    drugs: [],
    equipment: [],
    flightInfo: {
      plane: "",
      flightNumber: "",
      departure: "",
      arrival: "",
      date: "",
      notes: "",
    },
  },
  setMissionState: () => {}, // Initialize with an empty function
});

export function ViewMissionModal({ open, onClose, data }) {
  const [loading, setLoading] = useState(false);
  const [openSnackBar, setSnackBar] = useState(false);
  const [errorInserting, setErrorInserting] = useState(false);
  const [renderForm, setRenderForm] = useState(true);
  const [renderCheck, setRenderCheck] = useState(false);
  const [progressCounter, setProgressCounter] = useState(0);
  const [missionState, setMissionState] = useState({
    personele: [],
    drugs: [],
    equipment: [],
    flightInfo: {
      plane: "",
      flightNumber: "",
      departure: "",
      arrival: "",
      date: "",
      notes: "",
    },
  });

  const [values, setValues] = useState({
    type: "",
    value: 0,
  });

  const delayTimeout = () => {
    setTimeout(() => {
      setRenderCheck(false);
      setRenderForm(true);
    }, 2500);
  };

  const SanitizeInputs = (type, value) => {
    if (type != " " && value > 0) {
      return true;
    } else {
      return false;
    }
  };

  const insertStatus = () => {
    return errorInserting ? (
      <>
        <FaIcons.FaExclamation
          style={{
            color: "red",
            fontSize: "40px",
            padding: "80px",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: "15px",
          }}
        />
        <StyledSuccessMessage messageColor={"error"}>
          {data.product_name} Could Not Be Updated
        </StyledSuccessMessage>
      </>
    ) : (
      <>
        <FaIcons.FaCheck
          style={{
            color: "green",
            fontSize: "40px",
            padding: "80px",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: "15px",
          }}
        />
        <StyledSuccessMessage messageColor={"Success"}>
          {data.product_name} has been updated.
        </StyledSuccessMessage>
      </>
    );
  };

  const handleClose = () => {
    setSnackBar(!openSnackBar);
  };

  const checkEntryOfFields = (counter) => {
    if (
      missionState.drugs.length > 0 &&
      missionState.equipment.length > 0 &&
      missionState.personele.length > 0 &&
      missionState.flightInfo.arrival !== " " &&
      missionState.flightInfo.departure !== " " &&
      missionState.flightInfo.flightNumber !== " " &&
      missionState.flightInfo.plane !== " "
    ) {
      return <MissionSummaryPage page={counter} />;
    } else {
      setProgressCounter(0);
      alert("Please Complete All fields");
    }
  };
  
  const renderPages = (counter) => {
    if (counter === 0) {
      return <MissionFlightDetails />;
    } else if (counter === 1) {
      return <AddDrugsMissionsPage page={counter} />;
    } else if (counter === 2) {
      return <AddMedicalEquipmentPage page={counter} />;
    } else if (counter === 3) {
      return <AddCrewMissionsPage page={counter} />;
    } else if (counter === 4) {
      return checkEntryOfFields(counter); 
    }
  };
  
  

  function handleSubmit() {}

  if (!open) return null;
  return ReactDOM.createPortal(
    <>
      <missionDataContext.Provider
        value={{ missionState, setMissionState, progressCounter }}
      >
        <ModalWrapper>
          <StyledProgressBarWrapper>
            <StyledProgressItems
              onClick={() => setProgressCounter(0)}
              style={
                progressCounter === 0
                  ? { backgroundColor: "#0766f4", fontSize: "16px" }
                  : null
              }
            >
              1
            </StyledProgressItems>
            <StyledProgressItems
              onClick={() => setProgressCounter(1)}
              style={
                progressCounter === 1
                  ? { backgroundColor: "#0766f4", fontSize: "16px" }
                  : null
              }
            >
              2
            </StyledProgressItems>
            <StyledProgressItems
              onClick={() => setProgressCounter(2)}
              style={
                progressCounter === 2
                  ? { backgroundColor: "#0766f4", fontSize: "16px" }
                  : null
              }
            >
              3
            </StyledProgressItems>
            <StyledProgressItems
              onClick={() => setProgressCounter(3)}
              style={
                progressCounter === 3
                  ? { backgroundColor: "#0766f4", fontSize: "16px" }
                  : null
              }
            >
              4
            </StyledProgressItems>
            <StyledProgressItems
              onClick={() => setProgressCounter(4)}
              style={
                progressCounter === 4 || progressCounter == 5
                  ? { backgroundColor: "#0766f4", fontSize: "16px" }
                  : null
              }
            >
              5
            </StyledProgressItems>
          </StyledProgressBarWrapper>
          <ModalContent>
            {loading ? (
              <>
                {renderMissionsHeader({
                  title: `New MedicVac Mission`,
                  closeFunc: onClose,
                  // reloadState: reloadPage,
                })}
                <AddGrid style={{ height: "500px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "80px",
                    }}
                  >
                    <CircularProgress value={loading} />
                  </Box>
                </AddGrid>
              </>
            ) : (
              <>
                {renderForm && (
                  <>
                    {renderMissionsHeader({
                      title: `New MedicVac Mission`,
                      closeFunc: onClose,
                      // reloadState: reloadPage,
                    })}
                    <AddGrid>
                      <AddContentGrid
                        style={{
                          gridTemplateRows: "1fr 1fr 1fr",
                          height: "500px",
                          width: "400px",
                        }}
                      >
                        {renderPages(progressCounter)}
                      </AddContentGrid>
                    </AddGrid>
                    <StyledButtonsWrapper>
                      <StyledBackButton
                        onClick={() =>
                          progressCounter > 0
                            ? setProgressCounter(progressCounter - 1)
                            : null
                        }
                        position={progressCounter}
                      >
                        <FaIcons.FaArrowLeft style={{ padding: "10px" }} />
                      </StyledBackButton>
                      <StyledForthButton
                        onClick={() =>
                          progressCounter < 4
                            ? setProgressCounter(progressCounter + 1)
                            : null
                        }
                        position={progressCounter}
                      >
                        <FaIcons.FaArrowRight style={{ padding: "10px" }} />
                      </StyledForthButton>
                    </StyledButtonsWrapper>
                  </>
                )}
                {renderCheck && (
                  <>
                    {renderMissionsHeader({
                      title: `Edit`,
                      closeFunc: onClose,
                      // reloadState: reloadPage,
                    })}
                    <AddGrid>{insertStatus()}</AddGrid>
                  </>
                )}
              </>
            )}
          </ModalContent>
        </ModalWrapper>
      </missionDataContext.Provider>
    </>,
    document.getElementById("portal")
  );
}

const StyledListTable = styled.table`
  overflow-y: auto;
  border-collapse: collapse;
  background-image: linear-gradient(to right, #f7f7f7, #e6e6e6);
  border: 1px solid rgb(194, 194, 194);
  max-height: 300px;
  height: 500px;
  width: 100%;
  margin-top: 15px;
  border-radius: 3px;
`;

const StyledTableContainer = styled.div`
  overflow-y: auto;
  border-collapse: collapse;
  max-height: 500px;
  width: 100%;
`;

const StyledListTableItems = styled.tr`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  width: 100%;
  /* flex-direction: column;  */
  background-color: #e3e3e3;
  cursor: pointer;
  border-radius: 3px;

  &:hover {
    transition: background-color 0.2s ease-in-out;
    background-color: #dbdbdb;
  }
`;

const StyledListTd = styled.td`
  border-radius: 3px;
  width: 100%;
  gap: 4px;
  color: #464646;
  padding: 12px;
`;

const StyledIcons = styled.div`
  /* padding-right: 14px; */

  &:hover {
    transition: background-color 0.2s ease-in-out;
  }
`;

const StyledMissionHeader = styled.p`
  color: #646464;
  font-weight: none;
  font-size: 25px;
  margin: 0px;
`;

const StyledGreyLine = styled.div`
  height: 2px;
  width: 250px;
  background-color: #e0e0e0;
`;

const StyledButtonSelectContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

function AddCrewMissionsPage({ page }) {
  const { missionState, setMissionState } =
    React.useContext(missionDataContext);

  const [crewFetch, setCrewFetch] = useState([]);

  const asyncCrewSelect = DynamicaDropDownComp({
    options: crewFetch,
    optionsName: "email",
    ItemId: "id",
    placeholderText: "Crew",
    initialVal: "Select",
    disabledToF: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3331/users/MedicalCrew")
      .then((result) => {
        setCrewFetch(result.data);
      })
      .catch((e) => {
        //handle Error
      });
  }, []);

  //Allows you to remove and Add crew members based on the selected values.

  return (
    <>
      <StyledMissionHeader>Select The Crew</StyledMissionHeader>
      <StyledGreyLine />
      <StyledButtonSelectContainer>
        {asyncCrewSelect.render}
        <AddItemListButton
          onClickFunc={() => {
            if (asyncCrewSelect.selectedValue.value != null)
              setMissionState((prevState) => ({
                ...prevState,
                personele: [
                  ...prevState.personele,
                  {
                    name: asyncCrewSelect.selectedValue.label,
                    ID: asyncCrewSelect.selectedValue.value,
                  },
                ],
              }));
          }}
        />
      </StyledButtonSelectContainer>
      <StyledTableContainer>
        <StyledListTable>
          {missionState.personele.map((values, index) => (
            <StyledListTableItems>
              <StyledListTd>{values.name}</StyledListTd>
              <StyledIcons>
                <FaIcons.FaTrash
                  onClick={() => {
                    setMissionState((prevState) => ({
                      ...prevState,
                      personele: prevState.personele.filter(
                        (_, i) => i !== index
                      ),
                    }));
                  }}
                  style={{ paddingRight: "15px", color: "#464646" }}
                />
              </StyledIcons>
            </StyledListTableItems>
          ))}
        </StyledListTable>
      </StyledTableContainer>
      <StyledGreyLine style={{ width: "200px", marginTop: "1px" }} />
    </>
  );
}

const SelectRadioWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
`;

function AddDrugsMissionsPage({ page }) {
  const [fectchedData, setFetchedData] = useState([{}]);

  const asyncSelect = DynamicaDropDownComp({
    options: fectchedData,
    optionsName: "product_name",
    ItemId: "product_id",
    placeholderText: "Drugs",
    initialVal: "Select",
    disabledToF: false,
  });

  const { missionState, setMissionState } =
    React.useContext(missionDataContext);

  useEffect(() => {
    axios.get("http://localhost:3331/Med_stock").then((result) => {
      setFetchedData(result.data);
    });
  }, [page]);

  useEffect(() => {
    console.log(missionState);
  }, [asyncSelect]);

  const changeQty = (index, value) => {
    setMissionState((prevState) => {
      const updatedDrugs = [...prevState.drugs];
      let updatedQty = parseFloat(updatedDrugs[index].qty);

      if (isNaN(updatedQty)) {
        updatedQty = 0;
      }

      updatedQty += value;

      if (updatedQty < 0) {
        updatedQty = 0;
      }

      if (updatedQty === 0) {
        updatedDrugs.splice(index, 1);
      }

      updatedDrugs[index] = {
        ...updatedDrugs[index],
        qty: updatedQty,
      };

      return {
        ...prevState,
        drugs: updatedDrugs,
      };
    });
  };

  return (
    <>
      <StyledMissionHeader>Drugs(s)</StyledMissionHeader>
      <StyledGreyLine />
      <StyledButtonSelectContainer>
        {asyncSelect.render}
        <AddItemListButton
          onClickFunc={() => {
            if (asyncSelect.selectedValue.value != null)
              setMissionState((prevState) => ({
                ...prevState,
                drugs: [
                  ...prevState.drugs,
                  {
                    name: asyncSelect.selectedValue.label,
                    ID: asyncSelect.selectedValue.value,
                  },
                ],
              }));
          }}
        />
      </StyledButtonSelectContainer>
      <StyledTableContainer>
        <StyledListTable>
          {missionState.drugs.map((values, index) => (
            <StyledListTableItems>
              <StyledListTd>{values.name}</StyledListTd>
              <StyledIcons>
                <FaIcons.FaPlus
                  style={{
                    paddingRight: "10px",
                    paddingTop: "10px",
                    color: "#464646",
                  }}
                  onClick={() => changeQty(index, 1)} // Increment by 1
                />
                <FaIcons.FaMinus
                  style={{ marginRight: "5px", color: "#464646" }}
                  onClick={() => changeQty(index, -1)} // Decrement by 1
                />
              </StyledIcons>
              <span style={{ marginRight: "10px", position: "relative" }}>
                {values.qty}
              </span>
            </StyledListTableItems>
          ))}
        </StyledListTable>
      </StyledTableContainer>
      <StyledGreyLine style={{ width: "200px", marginTop: "1px" }} />
    </>
  );
}

function AddMedicalEquipmentPage({ page }) {
  const [fectchedData, setFetchedData] = useState([{}]);

  const asyncSelect = DynamicaDropDownComp({
    options: fectchedData,
    optionsName: "product_name",
    ItemId: "product_id",
    placeholderText: "Medical Equipment",
    initialVal: "Select",
    disabledToF: false,
  });

  const { missionState, setMissionState } =
    React.useContext(missionDataContext);

  useEffect(() => {
    axios.get("http://localhost:3331/MedicalEquipmentStock").then((result) => {
      setFetchedData(result.data);
    });
  }, [page]);

  const changeQty = (index, value) => {
    setMissionState((prevState) => {
      const updatedEquipment = [...prevState.equipment];
      let updatedQty = parseFloat(updatedEquipment[index].qty);

      if (isNaN(updatedQty)) {
        updatedQty = 0;
      }

      updatedQty += value;

      if (updatedQty < 0) {
        updatedQty = 0;
      }

      updatedEquipment[index] = {
        ...updatedEquipment[index],
        qty: updatedQty,
      };

      // If the quantity becomes 0, remove the item from the array
      if (updatedQty === 0) {
        updatedEquipment.splice(index, 1);
      }

      return {
        ...prevState,
        equipment: updatedEquipment,
      };
    });
  };

  return (
    <>
      <StyledMissionHeader>Equipment</StyledMissionHeader>
      <StyledGreyLine />
      <StyledButtonSelectContainer>
        {asyncSelect.render}
        <AddItemListButton
          onClickFunc={() => {
            if (asyncSelect.selectedValue.value != null)
              setMissionState((prevState) => ({
                ...prevState,
                equipment: [
                  ...prevState.equipment,
                  {
                    name: asyncSelect.selectedValue.label,
                    ID: asyncSelect.selectedValue.value,
                  },
                ],
              }));
          }}
        />
      </StyledButtonSelectContainer>
      <StyledTableContainer>
        <StyledListTable>
          {missionState.equipment.map((values, index) => (
            <StyledListTableItems>
              <StyledListTd>{values.name}</StyledListTd>
              <StyledIcons>
                <FaIcons.FaPlus
                  style={{
                    paddingRight: "10px",
                    paddingTop: "10px",
                    color: "#464646",
                  }}
                  onClick={() => changeQty(index, 1)}
                />
                <FaIcons.FaMinus
                  style={{ marginRight: "5px", color: "#464646" }}
                  onClick={() => changeQty(index, -1)}
                />
              </StyledIcons>
              <span style={{ marginRight: "10px", position: "relative" }}>
                {values.qty}
              </span>
            </StyledListTableItems>
          ))}
        </StyledListTable>
      </StyledTableContainer>
      <StyledGreyLine style={{ width: "200px", marginTop: "1px" }} />
    </>
  );
}

const StyledFlightInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  /* padding-top: 20px; */
  padding-bottom: 10px;
  /* height: 70%; */
`;

function MissionFlightDetails(page) {
  const [fectchedData, setFetchedData] = useState([{}]);
  const [flightData, setFlightData] = useState({
    plane: "",
    flightNumber: "",
    departure: "",
    arrival: "",
    date: "",
    notes: " ",
  });
  const [cache, setCache] = useState({});
  const { missionState, setMissionState } =
    React.useContext(missionDataContext);

  const asyncSelect = DynamicaDropDownComp({
    options: fectchedData,
    optionsName: "call_sign",
    ItemId: "call_sign",
    placeholderText: "Plane",
    initialVal: "Plane",
    disabledToF: false,
  });

  useEffect(() => {
    localStorage.setItem("Missions_Flight_Data", JSON.stringify(flightData));
  }, [flightData]);

  useEffect(() => {
    axios.get("http://localhost:3331/planes/getName").then((result) => {
      setFetchedData(result.data);
    });
  }, [page]);

  useEffect(() => {
    setMissionState((prevState) => ({
      ...prevState,
      flightInfo: {
        ...prevState.flightInfo,
        plane: asyncSelect.selectedValue.value,
      },
    }));
  }, [asyncSelect]);

  return (
    <>
      <StyledMissionHeader>Flight Details</StyledMissionHeader>
      <StyledFlightInfoWrapper>
        <StyledGreyLine style={{ marginBottom: "15px" }} />
        {asyncSelect.render}
        <StyledGreyLine
          style={{ marginTop: "10px", marginBottom: "10px", width: "0px" }}
        />
        <TextField
          id="flightNo"
          label="Flight Number"
          variant="outlined"
          fullWidth={true}
          type={"text"}
          style={{ paddingBottom: "20px" }}
          value={missionState.flightInfo.flightNumber}
          onChange={(e) => {
            setMissionState((prevState) => ({
              ...prevState,
              flightInfo: {
                ...prevState.flightInfo,
                flightNumber: e.target.value,
              },
            }));
          }}
          size="small"
        />
        <TextField
          id="input-with-icon-textfield"
          label="Departing From"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaIcons.FaPlaneDeparture />
              </InputAdornment>
            ),
          }}
          value={missionState.flightInfo.departure}
          onChange={(e) => {
            setMissionState((prevState) => ({
              ...prevState,
              flightInfo: {
                ...prevState.flightInfo,
                departure: e.target.value,
              },
            }));
          }}
          variant="outlined"
          style={{
            width: "100%",
            paddingBottom: "20px",
          }}
          size="small"
        />
        <TextField
          label="Arriving To"
          value={missionState.flightInfo.arrival}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaIcons.FaPlaneArrival />
              </InputAdornment>
            ),
          }}
          onChange={(e) => {
            setMissionState((prevState) => ({
              ...prevState,
              flightInfo: {
                ...prevState.flightInfo,
                arrival: e.target.value,
              },
            }));
          }}
          variant="outlined"
          style={{
            width: "100%",
            paddingBottom: "20px",
          }}
          size="small"
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Mission Date"
            onChange={(e) => {
              setMissionState((prevState) => ({
                ...prevState,
                flightInfo: {
                  ...prevState.flightInfo,
                  date: dayjs(e.$d).format("YYYY-MM-DD"),
                },
              }));
            }}
            sx={{ width: "100%", paddingBottom: "20px" }}
          />
        </LocalizationProvider>
        <TextField
          id="input-with-icon-textfield"
          label="Additional Notes"
          variant="outlined"
          style={{
            width: "100%",
          }}
          value={missionState.flightInfo.notes}
          multiline
          rows={4}
          onChange={(e) => {
            setMissionState((prevState) => ({
              ...prevState,
              flightInfo: {
                ...prevState.flightInfo,
                notes: e.target.value,
              },
            }));
          }}
        />
        <StyledGreyLine style={{ width: "200px", marginTop: "20px" }} />
      </StyledFlightInfoWrapper>
    </>
  );
}

const StyledSubSectionHeader = styled.div`
  font-size: 18px;
  padding-top: 4px;
  font-style: italic;
  color: #828282;
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;

const StyledInfoMissionSummary = styled.div`
  display: flex;
  color: #969696;
  padding-bottom: 9px;
  justify-content: flex-start;
`;

const StyledFlightDetailsSummary = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  flex-direction: column;
`;

const StyledArrow = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  color: black;
`;

const StyledTableSummaryWrap = styled.div`
  overflow: auto;
  height: 130px;
  width: 100%;
`;

const StyledNotesBox = styled.div`
  margin-top: 6px;
  border-radius: 2px;
  border: 1px solid rgb(194, 194, 194);
  width: 98%;
  font-size: 14px;
  color: rgb(87, 87, 87);
  max-height: 100px;
  height: 100px;
  background-color: white;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
  padding: 5px;
`;

function MissionSummaryPage(page) {
  const { missionState, setMissionState } =
    React.useContext(missionDataContext);

  useEffect(() => {
    console.log(missionState.flightInfo.departure);
  }, [missionState]);

  const handleSubmit = () => {
    const stringifiedData = JSON.stringify(missionState); 
    console.log(stringifiedData); 
    axios
      .post("http://localhost:3331/Missions/NewMission", { data: missionState })
      .then((result) => {});
  };
  return (
    <>
      <StyledFlightDetailsSummary>
        <StyledSubSectionHeader> Flight Details</StyledSubSectionHeader>
        <StyledGreyLine
          style={{ width: "100%", marginBottom: "15px", marginTop: "5px" }}
        />
        <StyledInfoMissionSummary>
          Flight NO:
          <span style={{ color: "#575757", paddingLeft: "4px" }}>
            {missionState.flightInfo.flightNumber}
          </span>
        </StyledInfoMissionSummary>
        <StyledInfoMissionSummary>
          Plane:{" "}
          <span style={{ color: "#575757", paddingLeft: "4px" }}>
            {missionState.flightInfo.plane}
          </span>
        </StyledInfoMissionSummary>
        <StyledInfoMissionSummary style={{ paddingBottom: "0px" }}>
          <span style={{ color: "#575757" }}>
            {" "}
            {missionState.flightInfo.departure}
          </span>
          <StyledArrow>
            {" "}
            <FaIcons.FaArrowRight />
          </StyledArrow>
          <span style={{ color: "#575757" }}>
            {missionState.flightInfo.arrival}
          </span>

          <span style={{ color: "#575757", paddingLeft: "10px" }}>
            ({missionState.flightInfo.date})
          </span>
        </StyledInfoMissionSummary>
        <StyledGreyLine
          style={{ width: "100%", marginBottom: "0px", marginTop: "15px" }}
        />
      </StyledFlightDetailsSummary>
      <StyledFlightDetailsSummary>
        <MissionSummaryToggleList
          data={missionState}
        ></MissionSummaryToggleList>
        <StyledGreyLine
          style={{ width: "100%", marginBottom: "5px", marginTop: "20px" }}
        />
        <StyledSubSectionHeader style={{ paddingTop: "15px" }}>
          {" "}
          Additional Notes
        </StyledSubSectionHeader>
        <StyledGreyLine
          style={{ width: "100%", marginBottom: "10px", marginTop: "6px" }}
        />
        <StyledNotesBox>{missionState.flightInfo.notes}</StyledNotesBox>
      </StyledFlightDetailsSummary>
      <CreateMission onClickFunc={() => handleSubmit()} />
    </>
  );
}
