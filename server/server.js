import express from "express";
import mysql from "mysql2";
import usersRouter from "./routes/users.js";
import MaintenanceStock from "./routes/Maintanance_stock.js";
import StockRouter from "./routes/Stock.js";
import SupplierRouter from "./routes/Suppliers.js";
import cors from "cors";
import PlaneRouter from "./routes/planes.js";
import MedRouter from "./routes/Med_stock.js";
import { PartOrder, MedOrder, DrugOrder } from "./routes/Orders.js";
import bodyParser from "body-parser";
import pdfRoute from "./Services/PurchaseOrderService.js";
import generateTableRoute from "./Services/ExportTableService.js";
import exportPoPdf from "./Services/ExportPartPOService.js";
import { MissionRouter } from "./routes/Missions.js";
import MedEquipmentRouter from "./routes/MedicalEquipmentStock.js";
import cookieParser from "cookie-parser";
import { resolveSoa } from "dns";
import { userAuthMiddleWare } from "./routes/users.js";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    method: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use("/users", usersRouter);
app.use("/Maintanance_stock", MaintenanceStock);
app.use("/Missions", MissionRouter);
app.use("/Stock", StockRouter);
app.use("/Supplier", SupplierRouter);
app.use("/planes", PlaneRouter);
app.use("/Med_stock", MedRouter);
app.use("/MedicalEquipmentStock", MedEquipmentRouter);
app.use("/Orders", PartOrder, MedOrder, DrugOrder);
app.use("/Services/pdfRoute", pdfRoute);
app.use("/Services/generateTableRoute", generateTableRoute);
app.use("/Services/exportPoPdf", exportPoPdf);

const dbport = 3301;
const dbhost = "localhost";
const dbname = "Stock_AOM";
const dbuser = "root";
const dbpass = "";

const pool = mysql.createPool({
  host: dbhost,
  port: dbport,
  user: dbuser,
  database: dbname,
  password: dbpass,
});

app.route("/retrieveRefreshToken").post((req, res) => {
  const tokenId = req.body.token;
  const query = `SELECT token FROM refresh_tokens WHERE token_id = ?`;
  pool.query(query, tokenId, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error occurred during database query");
    } else {
      if (result.length > 0) {
        res.send(result[0].token);
      } else {
        res.status(404).send("No refresh tokens found");
      }
    }
  });
});

const PORT = 3331;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
