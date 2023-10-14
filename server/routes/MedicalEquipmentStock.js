import express from "express";
import mysql from "mysql2";
import { userAuthMiddleWare } from "./users.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const MedEquipmentRouter = express();

MedEquipmentRouter.use(userAuthMiddleWare);

const dbport = 3301;
const dbhost = "localhost";
const dbname = "Stock_AOM";
const dbuser = "root";
const dbpass = " ";

MedEquipmentRouter.use(bodyParser.urlencoded({ extended: true }));

//this configures our environment file .env
MedEquipmentRouter.use(cookieParser());
dotenv.config();
MedEquipmentRouter.use(bodyParser.json());

MedEquipmentRouter.use(
  cors({
    origin: "http://localhost:5173",
    method: ["GET", "POST", "PUT", "DELETE"],
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

MedEquipmentRouter.route("/getAllItems").get((req, res) => {
  const query =
    "  SELECT product_id, product_name, quantity, location, DATE_FORMAT(date_of_expiration, '%Y-%m-%d') AS FormatedDate FROM MedicalEquipmentStock";

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

MedEquipmentRouter.route("/:ID").delete((req, res) => {
  const query = "DELETE FROM MedicalEquipmentStock WHERE product_id = ?";
  pool.query(query, req.params.ID, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.status(200).send({ message: "done" });
    }
  });
});

//Add items from the stock table.
MedEquipmentRouter.route("/AddItems").post((req, res) => {
  const query =
    "INSERT INTO MedicalEquipmentStock(product_name, quantity, date_of_expiration, location) VALUES (?,?,?,?)";

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

MedEquipmentRouter.route("/EditItems/:ID").put((req, res) => {
  const query = `UPDATE MedicalEquipmentStock
               SET product_name = ?, quantity = ?, date_of_expiration = ?, location = ?
               WHERE product_id = ${req.params.ID}`;

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

MedEquipmentRouter.route("/ERHistory").get((req, res) => {
  //do inner joins for user and product.
  const query =
    'SELECT fname, lname, product_name, ExitEntryMedEquipment.quantity, type,flight_num ,DATE_FORMAT(added_at, "%Y-%m-%d") AS FormattedDate \
  FROM ExitEntryMedEquipment\
  INNER JOIN users ON users.id = ExitEntryMedEquipment.uid\
  INNER JOIN MedicalEquipmentStock ON MedicalEquipmentStock.product_id = ExitEntryMedEquipment.product_id;';

  pool.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500);
    } else {
      res.status(200).send(result);
    }
  });
});

MedEquipmentRouter.route("/StockUpdateMission/:ID").put((req, res) => {
  const productID = req.params.ID;

  //Retrieve the The current quantity of the product.
  const query =
    "SELECT quantity FROM MedicalEquipmentStock WHERE product_id = ? ";

  pool.query(query, productID, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500);
    } else {
      const oldQty = result[0].quantity;
      const removalQty = req.body.quantity;
      const newQty = oldQty - removalQty;

      const updateQuery = `UPDATE MedicalEquipmentStock SET quantity = ${newQty} WHERE product_id = ${productID}`;
      //Update the quantity based on the difference of the old quantity and the removal quantity
      pool.query(updateQuery, (error, response) => {
        if (err) {
          console.log(err);
          res.status(500);
        } else {
          //Log the Removal of each drug in the database and keep a record of so.
          const insertERQuery =
            "INSERT INTO ExitEntryMedEquipment(product_id, uid, quantity, type , flight_num) VALUES (?,?,?,?,?)";
          pool.query(
            insertERQuery,
            [
              productID,
              1684438793,
              removalQty,
              "Removal",
              req.body.flightNumber,
            ],
            (ErERR, ErResult) => {
              if (ErERR) {
                console.log(ErERR);
                res.status(500);
              } else {
                console.log("We made it ");
                res.status(200);
              }
            }
          );
        }
      });
    }
  });
});

export default MedEquipmentRouter;
