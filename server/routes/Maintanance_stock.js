import express from "express";
import mysql from "mysql2";
import { userAuthMiddleWare } from "./users.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const MaintenanceStock = express();
MaintenanceStock.use(bodyParser.urlencoded({ extended: true }));

MaintenanceStock.use(cookieParser());
dotenv.config();
MaintenanceStock.use(bodyParser.json());

const dbport = 3301;
const dbhost = "localhost";
const dbname = "Stock_AOM";
const dbuser = "root";
const dbpass = " ";

MaintenanceStock.use(
  cors({
    origin: "http://localhost:5173",
    method: ["GET", "POST", "PUT"],
    credentials: true,
  })
);

const pool = mysql.createPool({
  host: dbhost,
  port: dbport,
  user: dbuser,
  database: dbname,
  dbpass: dbpass,
});

MaintenanceStock.use(userAuthMiddleWare);

MaintenanceStock.route("/")
  .get((req, res) => {
    const query = "SELECT * from Maintenance_stock";
    pool.query(query, (err, response) => {
      if (err) {
        res.status(500).send({ error: "An error occurred" });
      } else {
        res.status(200).send(response);
      }
    });
  })
  .post((req, res) => {
    const query = `INSERT INTO Maintenance_stock (part_number, product_name, product_type, call_sign, price, quantity)
     VALUES(?,?,?,?,?,?)`;

    pool.query(query, req.body.data, (err, result) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .send({ message: "Error inserting data into database." });
      } else {
        res
          .status(200)
          .send({ message: `${req.body.data[0]} inserted successfully.` });
      }
    });
  });

MaintenanceStock.route("/View").get((req, res) => {
  const query =
    "SELECT * FROM Maintenance_stock INNER JOIN MaintenanceOrders ON Maintenance_stock.product_id = MaintenanceOrders.product_id";

  pool.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

MaintenanceStock.route("/MatchItemPn/:pn").get((req, res) => {
  const query =
    "SELECT product_name FROM Maintenance_stock WHERE part_number = ?";

  pool.query(query, req.params.pn, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error retrieving product_name.");
    } else {
      if (result.length === 0) {
        res.status(404).send("Product not found for the given part number.");
      } else {
        res.status(200).json(result);
      }
    }
  });
});

MaintenanceStock.route("/pn").get((req, res) => {
  const query = "SELECT part_number FROM Maintenance_stock";

  pool.query(query, (err, result) => {
    if (err) {
      res.status(500).json({ error: "An error occurred" });
    } else {
      res.status(200).send(result);
    }
  });
});

MaintenanceStock.route("/:name&:callSign").get((req, res) => {
  const query =
    "SELECT part_number FROM Maintenance_stock WHERE product_name = ? AND call_sign = ? ";

  pool.query(query, [req.params.name, req.params.callSign], (err, result) => {
    if (err) {
      res.status(500).send({ message: "Error" });
    } else {
      res.status(200).send({ message: "Success", payload: result });
    }
  });
});

MaintenanceStock.route("/TotalStock").get((req, res) => {
  const query = "SELECT COUNT(*) AS total FROM Maintenance_stock";

  pool.query(query, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.status(200).send(result);
    }
  });
});

export default MaintenanceStock;
