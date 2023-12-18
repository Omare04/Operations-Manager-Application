import Home from "../pages/Home";
import "../Style.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Add from "../pages/Orders/Add";
import React, {
  useContext,
  useEffect,
  useReducer,
  useState,
  createContext,
} from "react";
import Plane_list from "../pages/Plane_list";
import Drug_stock from "../pages/Stock/Drug_stock";
import Med_Order from "../pages/Orders/Med_Order";
import Suppliers from "../pages/Suppliers";
import Header from "../components/layout/Header";
import MaintenanceStock from "../pages/Stock/MaintenanceStock";
import axios from "axios";
import Layout from "../components/layout/Layout";
import ExitEntryHistory from "../pages/Stock/ExitEntryHistory";
import ViewMedOrders from "../pages/Orders/ViewMedOrders";
import ViewPartOrders from "../pages/Orders/ViewPartOrders";
import ViewPastMedOrders from "../pages/Orders/ViewPastMedOrders";
import ViewPastPartOrders from "../pages/Orders/ViewPastPartOrders";
import PrivateRoutes from "../Helper/privateRoutes";
import Missions from "../pages/Missions/Missions";
import styled from "styled-components";
import MedicalEquipmentStock from "../pages/Stock/MedicalEquipmentStock";
import ExitEntryHistoryEquipment from "../pages/Stock/ExitEntryHistoryEquipment";
import TextField from "@mui/material/TextField";
import { LoginButton } from "../components/content/Input_components";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

export const AuthContext = createContext({
  user: {},
  authenticated: false,
  Login: () => {},
  logout: () => {},
});

const StyledReloadPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed; /* Use 'fixed' position to cover the entire viewport */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-image: linear-gradient(#f5f5f5, #7b7b7bd1);
`;

export function ProtectedRoutes() {
  const [reloadPage, setReloadPage] = useState(true);

  const [user, setUser] = useState({
    user: {
      id: 0,
      fname: "",
      lname: "",
      email: "",
      position: "",
    },
    authenticated: null,
  });

  const renderReloadPage = () => {
    return (
      <>
        <StyledReloadPage>
          <StyledLogo
            src={"../../../public/AOM_logo_horizontal.png"}
            style={{ paddingLeft: "30px" }}
          />
          <Box sx={{ width: "100%" }}>
            <LinearProgress color="success" />
          </Box>
        </StyledReloadPage>
      </>
    );
  };

  const logout = (state) => {
    setUser({ user: null, authenticated: state });
  };

  const Login = (user, state) => {
    setUser({
      user: user,
      authenticated: state,
    });
  };

  useEffect(() => {
    setReloadPage(true);
    axios
      .get("http://localhost:3331/users/token", { withCredentials: true })
      .then((result) => {
        setUser({
          user: result.data.user,
          authenticated: result.data.loggedIn,
        });

        setTimeout(() => {
          setReloadPage(false);
        }, 1000);
      })
      .catch((e) => {
        setTimeout(() => {
          setReloadPage(false);
        }, 1000);
      });
  }, []);

  //When the page re-render, the client will require the refresh to be authenticated to set the authenticated state.

  //Split them up into 3 for code readability.
  const renderAdminRoutes = (auth, position) => {
    if (auth && position == "admin") {
      return (
        <>
          <Layout position={position}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pages/Orders/Add" element={<Add />} />
              <Route path="/pages/Missions/Missions" element={<Missions />} />
              <Route path="/pages/Plane_List" element={<Plane_list />} />
              <Route path="/pages/Stock/Drug_stock" element={<Drug_stock />} />
              <Route
                path="/pages/Stock/ExitEntryHistoryEquipment"
                element={<ExitEntryHistoryEquipment />}
              />
              <Route
                path="/pages/Stock/MedicalEquipmentStock"
                element={<MedicalEquipmentStock />}
              />
              <Route
                path="/pages/Orders/ViewMedOrders"
                element={<ViewMedOrders />}
              />
              <Route
                path="/pages/Orders/ViewPastMedOrders"
                element={<ViewPastMedOrders />}
              />
              <Route
                path="/pages/Orders/ViewPastPartOrders"
                element={<ViewPastPartOrders />}
              />
              <Route
                path="/pages/Orders/ViewPartOrders"
                element={<ViewPartOrders />}
              />
              <Route
                path="/pages/Stock/ExitEntryHistory"
                element={<ExitEntryHistory />}
              />
              <Route path="/pages/Orders/Med_Order" element={<Med_Order />} />
              <Route path="/pages/Suppliers" element={<Suppliers />} />
              <Route
                path="/pages/Stock/MaintenanceStock"
                element={<MaintenanceStock />}
              />
              <Route
                path="/components/layout/Header.tsx"
                element={<Header toggle={undefined} sidebar={undefined} />}
              />
            </Routes>
          </Layout>
        </>
      );
    } else {
      //Redirect to the login page
      return;
    }
  };

  const renderNurseRoutes = (auth, position) => {
    if (auth && position == "nurse") {
      return (
        <>
          <Layout position={position}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pages/Missions/Missions" element={<Missions />} />
              <Route
                path="/pages/Orders/ViewPastMedOrders"
                element={<ViewPastMedOrders />}
              />
              <Route path="/pages/Orders/Med_Order" element={<Med_Order />} />
              <Route
                path="/pages/Orders/ViewMedOrders"
                element={<ViewMedOrders />}
              />
              <Route
                path="/components/layout/Header.tsx"
                element={<Header toggle={undefined} sidebar={undefined} />}
              />
              <Route
                path="/pages/Stock/MedicalEquipmentStock"
                element={<MedicalEquipmentStock />}
              />
              <Route path="/pages/Stock/Drug_stock" element={<Drug_stock />} />
            </Routes>
          </Layout>
        </>
      );
    } else {
      //Redirect to the login page
      return;
    }
  };

  const renderStockGuyRoutes = (auth, position) => {
    if (auth && position == "stock") {
      return (
        <>
          <Layout>
            <Routes>
              <Route
                path="/pages/Orders/ViewPastPartOrders"
                element={<ViewPastPartOrders />}
              />
              <Route path="/" element={<Home />} />
              <Route path="/pages/Orders/Add" element={<Add />} />
              <Route path="/pages/Suppliers" element={<Suppliers />} />
              <Route
                path="/pages/Stock/MaintenanceStock"
                element={<MaintenanceStock />}
              />
              <Route
                path="/pages/Orders/ViewPartOrders"
                element={<ViewPartOrders />}
              />
              <Route path="/pages/Plane_List" element={<Plane_list />} />
            </Routes>
          </Layout>
        </>
      );
    } else {
      //Redirect to the login page
      return;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, authenticated: user.authenticated, Login, logout }}
    >
      {reloadPage ? (
        renderReloadPage()
      ) : (
        <>
          {user.authenticated ? (
            <>
              {user.user?.position === "admin" &&
                renderAdminRoutes(user.authenticated, user.user?.position)}
              {user.user?.position === "nurse" &&
                renderNurseRoutes(user.authenticated, user.user?.position)}
              {user.user?.position === "stock" &&
                renderStockGuyRoutes(user.authenticated, user.user?.position)}
            </>
          ) : (
            <LoginPage />
          )}
        </>
      )}
    </AuthContext.Provider>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-image: linear-gradient(#fff, #c1c1c1);
`;

const StyledLoginBox = styled.div`
  display: flex;
  border: 1px solid #c3c3c3;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  width: 500px;
  height: 320px;
  background-color: white;
`;

const StyledLogo = styled.img`
  height: 85px;
  color: #cdcdcd;
  width: 345px;
  padding-bottom: 20px;
`;

const StyledLoginTitle = styled.p`
  font-size: 25px;
  color: #484848;
`;

const StyledErrorMessage = styled.div`
  color: red;
  font-size: 18px;
  text-align: center;
  padding: 10px;
`;

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { Login, authenticated } = useContext(AuthContext);
  const [errorMessageState, setErrorMessageState] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const LoginFunction = (email, password) => {
    if (email.length && password.length > 0) {
      setLoading(true);
      axios
        .post(
          "http://localhost:3331/users/login",
          {
            email: email,
            password: password,
          },
          { withCredentials: true }
        )
        .then((result) => {
          if (result.data.incorrect) {
            setTimeout(() => {
              setErrorMessage(
                "The Email/password is incorrect, please try again "
              );
              setErrorMessageState(true);
              setLoading(false);
            }, 2000);
          } else {
            setErrorMessage(
              "The Email/password is incorrect, please try again "
            );
            setErrorMessageState(false);
            setTimeout(() => {
              setLoading(false);
              Login(result.data.user, result.data.loggedIn);
            }, 2000);
          }
        })
        .catch((err) => {
          setTimeout(() => {
            setErrorMessage(
              "The Email/password is incorrect, please try again "
            );
            setErrorMessageState(true);
            setLoading(false);
          }, 2000);
        });
    } else {
      setErrorMessageState(true);
      setErrorMessage("Please complete all required fields.");
      setTimeout(() => {
        setErrorMessageState(false);
      }, 2000);
    }
  };

  return authenticated ? null : (
    <>
      <StyledWrapper>
        <StyledLogo src={"../../../public/AOM_logo_horizontal.png"} />
        {errorMessageState ? (
          <StyledErrorMessage> {errorMessage}</StyledErrorMessage>
        ) : null}
        <StyledLoginBox>
          {loading ? (
            <CircularProgress value={loading} />
          ) : (
            <>
              <StyledLoginTitle>AOM Login Terminal</StyledLoginTitle>
              <TextField
                id="email"
                label="Email"
                variant="filled"
                fullWidth={true}
                type={"text"}
                style={{ paddingBottom: "20px", width: "60%" }}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                size="small"
                required
              />
              <TextField
                required
                id="password"
                label="Password"
                variant="filled"
                fullWidth={true}
                type={"password"}
                style={{ paddingBottom: "20px", width: "60%" }}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                size="small"
              />
              <LoginButton onClickFunc={() => LoginFunction(email, password)} />
            </>
          )}
        </StyledLoginBox>
      </StyledWrapper>
    </>
  );
}
