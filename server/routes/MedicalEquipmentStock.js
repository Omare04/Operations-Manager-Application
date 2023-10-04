import express from "express";
import mysql from "mysql2";
import MedicalEquipmentParsed from "../StockDataFiles/MedicalEquipmentParsed.json" assert { type: "json" };

const MedEquipmentRouter = express.Router();

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

MedEquipmentRouter.route("/getAllItems").get((req, res) => {
  const query = "SELECT * FROM MedicalEquipmentStock";

  pool.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(result);
    }
  });
});

MedEquipmentRouter.route("/")
  .post((req, res) => {
    MedicalEquipmentParsed.map((value, index) => {
      const query =
        "INSERT INTO MedicalEquipmentStock (product_name, quantity) VALUES (?, ?)";
      const values = [value.productName, value.quantity];
      pool.query(query, values, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).send({ message: "Insert Success" });
        }
      });
    });
  })
  .get((req, res) => {
    const query = "SELECT product_name, product_id FROM MedicalEquipmentStock";

    pool.query(query, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send(result);
      }
    });
  });

//Add items from the stock table.
MedEquipmentRouter.route("/AddItems").post((req, res) => {
  const query =
    "INSERT INTO MedicalEquipmentStock(product_name, quantity, date_of_expiration, location) VALUES (?,?,?,?)";

  console.log("start");

  pool.query(query, req.body.data, (err, result) => {
    if (err) {
      res.status(500);
      console.log(err);
    } else {
      res.status(200).send({
        message: `${req.body.data.product_name} Has Been Added To The Stock`,
      });
    }
  });
});

export default MedEquipmentRouter;
