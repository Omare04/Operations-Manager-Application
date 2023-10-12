import express, { query, response } from "express";
import mysql from "mysql2";
import { userAuthMiddleWare } from "./users.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

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
  dbpass: dbpass,
});

const SupplierRouter = express.Router();
SupplierRouter.use(cookieParser());
SupplierRouter.use(userAuthMiddleWare);
SupplierRouter.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
SupplierRouter.use(bodyParser.json());
SupplierRouter.use(
  cors({
    origin: "http://localhost:5173",
    method: ["GET", "POST", "PUT"],
    credentials: true,
  })
);

SupplierRouter.route("/")
  .get((req, res) => {
    const query = "SELECT * FROM Suppliers";
    pool.query(query, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  })
  .post((req, res) => {
    const query =
      "INSERT INTO Suppliers (Supplier, Country, email, address, PhoneNumber) VALUES(?,?,?,?,?)";
    pool.query(query, req.body.data, (err, response) => {
      if (err) {
        res.send({ message: err });
      } else {
        res.send({ message: `${req.body.data[0]} has been added` });
      }
    });
  });

SupplierRouter.route("/:Supplier").get((req, res) => {
  const query = "SELECT * FROM Suppliers WHERE Supplier = ?";

  pool.query(query, [req.params.Supplier], (err, response) => {
    if (err) {
      console.log(err);
    } else {
      res.send(response);
      return;
    }
  });
});

SupplierRouter.route("/:PO").get((req, res) => {
  const query =
    "SELECT Supplier, Country, email, address,PhoneNumber FROM Suppliers WHERE Supplier_id = ?";

  pool.query(query, req.params.PO, (err, result) => {
    if (err) {
      res.send(err).status(500);
    } else {
      res.send(result).status(200);
    }
  });
});

SupplierRouter.route("/Match/:name").get((req, res) => {
  const query = "SELECT Supplier_id FROM Suppliers WHERE Supplier = ? ";

  pool.query(query, [req.params.name], (err, response) => {
    if (err) {
      res.status(500).send({ message: "Error: " + err });
    } else {
      res.status(200).json(response[0]);
    }
  });
});

SupplierRouter.route("/SupplierStats/:ID").get((req, res) => {
  const query = `
  SELECT Suppliers.Supplier, COUNT(*) AS SupplierCount, CAST(SUM(MaintenanceOrders.price) AS INT) AS AnnualTotal
  FROM MaintenanceOrders
  INNER JOIN Suppliers ON Suppliers.Supplier_id = MaintenanceOrders.Supplier_id
  WHERE Suppliers.Supplier_id IN (28, 145, 48, 146)
  AND YEAR(DateOrdered) = YEAR(CURRENT_TIMESTAMP)
  GROUP BY Suppliers.Supplier;
`;

  pool.query(query, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const supplierStats = result.map((row) => ({
        supplier: row.Supplier,
        supplierCount: row.SupplierCount,
        AnnualTotal: row.AnnualTotal,
      }));
      res.send(supplierStats);
    }
  });
});

export default SupplierRouter;
