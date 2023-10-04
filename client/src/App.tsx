import Home from "./pages/Home";
import "./Style.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Add from "./pages/Orders/Add";
import React, { useContext, useEffect, useReducer, useState } from "react";
import Plane_list from "./pages/Plane_list";
import Drug_stock from "./pages/Stock/Drug_stock";
import Med_Order from "./pages/Orders/Med_Order";
import Suppliers from "./pages/Suppliers";
import { SignIn } from "./pages/Registration/sign_in";
import { LoginContext } from "./Helper/userContext";
import Header from "./components/layout/Header";
import { useAuthWrapper } from "./Hooks/useAuth";
import MaintenanceStock from "./pages/Stock/MaintenanceStock";
import axios from "axios";
import Cookies from "universal-cookie";
import Layout from "./components/layout/Layout";
import ExitEntryHistory from "./pages/Stock/ExitEntryHistory";
import ViewMedOrders from "./pages/Orders/ViewMedOrders";
import ViewPartOrders from "./pages/Orders/ViewPartOrders";
import ViewPastMedOrders from "./pages/Orders/ViewPastMedOrders";
import ViewPastPartOrders from "./pages/Orders/ViewPastPartOrders";
import PrivateRoutes from "./Helper/privateRoutes";
import Missions from "./pages/Missions/Missions";
import styled from "styled-components";
import MedicalEquipmentStock from "./pages/Stock/MedicalEquipmentStock";

function App() {
  const [cookie, setCookie] = useState(null);

  useEffect(() => {
    const cookies = new Cookies();
    setCookie(cookies.get("userSession"));
  }, []);

  useEffect(() => {
    axios
      .post("http://localhost:3331/users/token", { token: cookie })
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e.status);
      });
  }, [cookie]);

  return (
    <>
      <Layout>
        <Routes>
          {/* These are going to be the protected routes */}
          <Route path="/" element={<Home />} />
          <Route path="/pages/Orders/Add" element={<Add />} />
          <Route path="/pages/Missions/Missions" element={<Missions />} />
          <Route path="/pages/Plane_List" element={<Plane_list />} />
          <Route path="/pages/Stock/Drug_stock" element={<Drug_stock />} />
          <Route path="/pages/Stock/MedicalEquipmentStock" element={<MedicalEquipmentStock/>} />
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
          <Route element={<PrivateRoutes />}></Route>
        </Routes>
      </Layout>
      <Routes>
        <Route path="/pages/Registration/sign_in" element={<SignIn />} />
      </Routes>
    </>
  );
}

export default App;
