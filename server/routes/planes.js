import express, { response } from "express";
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
const PlaneRouter = express();

PlaneRouter.use(cookieParser());
PlaneRouter.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
PlaneRouter.use(bodyParser.json());

PlaneRouter.use(
  cors({
    origin: "http://localhost:5173",
    method: ["GET", "POST", "PUT"],
    credentials: true,
  })
);
PlaneRouter.use(userAuthMiddleWare);

PlaneRouter.route("/")
  .get((req, res) => {
    const query = "SELECT * from planes";
    pool.query(query, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  })
  .post((req, res) => {});

PlaneRouter.route("/PartMatch/:part").get((req, res) => {
  const product_name = req.params.part;
  const query =
    "Select call_sign from Maintenance_stock where product_name = ? ";

  pool.query(query, product_name, (err, response) => {
    if (err) {
      res.send(err);
    } else {
      res.send(response);
    }
  });
});

PlaneRouter.route("/Add").post((req, res) => {
  console.log(req.body.data);
  const query =
    "INSERT INTO planes(call_sign, company, model_name, year) VALUES(?,?,?,?)";

  pool.query(query, req.body.data, (err, result) => {
    if (err) {
      res.send({ message: "err" + err });
    } else {
      res.send({ message: req.body.data[0] + " has been added" });
    }
  });
});

PlaneRouter.route("/getName").get((req, res) => {
  const query = "SELECT call_sign FROM planes";

  pool.query(query, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.status(200).send(result);
    }
  });
});

export default PlaneRouter;
