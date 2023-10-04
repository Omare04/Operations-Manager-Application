import express from 'express';
import mysql from 'mysql2/promise';
import usersRouter from './routes/users.js';
import MaintenanceStock from './routes/Maintanance_stock.js';
import StockRouter from './routes/Stock.js';
import SupplierRouter from './routes/Suppliers.js';
import cors from 'cors';
import PlaneRouter from './routes/planes.js';
import MedRouter from './routes/Med_stock.js';
import { PartOrder, MedOrder, DrugOrder} from './routes/Orders.js';
import bodyParser from 'body-parser';
import session from 'express-session';
import pdfRoute from './Services/PurchaseOrderService.js';
import generateTableRoute from './Services/ExportTableService.js';
import exportPoPdf from './Services/ExportPartPOService.js';
import { MissionRouter } from './routes/Missions.js';
import MedEquipmentRouter from "./routes/MedicalEquipmentStock.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  method: ["GET", "POST"],
  credentials: true
}));

app.use(bodyParser.json());
app.use('/users', usersRouter);
app.use('/Maintanance_stock', MaintenanceStock);
app.use('/Missions', MissionRouter);
app.use('/Stock', StockRouter);
app.use('/Supplier', SupplierRouter);
app.use('/planes', PlaneRouter);
app.use('/Med_stock', MedRouter);
app.use('/MedicalEquipmentStock', MedEquipmentRouter);
app.use('/Orders', PartOrder, MedOrder, DrugOrder)
app.use('/Services/pdfRoute', pdfRoute)
app.use('/Services/generateTableRoute', generateTableRoute)
app.use('/Services/exportPoPdf', exportPoPdf)

const dbport = 3301;
const dbhost = "localhost";
const dbname = "Stock_AOM";
const dbuser = "root";
const dbpass = " ";

const pool = mysql.createPool({
  host: dbhost,
  port: dbport,
  user: dbuser,
  database: dbname,
  password: dbpass,
});

app.use(session({
  secret: 'bloobsecretmonkey',
  resave: false,
  saveUninitialized: false,
}));

const PORT = 3331;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
