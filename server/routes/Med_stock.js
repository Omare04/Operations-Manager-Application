import express, { query } from "express";
import mysql from "mysql2";
import { userAuthMiddleWare } from "./users.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const app = express();

app.use(express.json());

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

const MedRouter = express.Router();
MedRouter.use(cookieParser());
MedRouter.use(userAuthMiddleWare);
MedRouter.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
MedRouter.use(bodyParser.json());
MedRouter.use(
  cors({
    origin: "http://localhost:5173",
    method: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

MedRouter.route("/")
  .get((req, res) => {
    pool.query(
      "SELECT product_name, product_id FROM Drug_stock ORDER BY Quantity DESC",
      (err, response) => {
        if (err) {
          res.send(err);
        } else {
          res.send(response);
        }
      }
    );
  })
  .post((req, res) => {
    pool.query(
      "INSERT INTO Drug_stock (product_type, product_name, Date_Of_Expiry, location_flightnum, user_id, Quantity) VALUES(?,?,?,?,?,?)",
      req.body.data,
      (err, result) => {
        if (err) {
          console.error(err);
          res
            .status(500)
            .send({ message: "Error inserting data into the database." });
        } else {
          res.status(200).send({
            message: `${req.body.data[1]} has been added to the Drug stock`,
          });
        }
      }
    );
  });

MedRouter.route("/ListOfDrugs").get((req, res) => {
  pool.query(
    "SELECT * FROM Drug_stock ORDER BY Quantity DESC",
    (err, response) => {
      if (err) {
        res.send(err);
      } else {
        res.send(response);
      }
    }
  );
});

MedRouter.route("/History").get((req, res) => {
  const joinQuery =
    "SELECT fname, lname,product_name, ExitEntryMedHistory.quantity, type, FlightNum, CONCAT(DATE_FORMAT(added_at, '%Y-%m-%d'), ' , At: ',DATE_FORMAT(added_at, '%H:%i'))\
    AS formatted_added_at FROM ExitEntryMedHistory \
    INNER JOIN Drug_stock ON ExitEntryMedHistory.product_id = Drug_stock.product_id \
    INNER JOIN users ON ExitEntryMedHistory.uid = users.id";

  pool.query(joinQuery, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(200).send({ message: "Error" });
    } else {
      res.send(result);
    }
  });
});

MedRouter.route("/History/Entries").get((req, res) => {
  const joinQuery =
    "SELECT fname, lname, product_name, ExitEntryMedHistory.quantity, type, FlightNum, CONCAT(DATE_FORMAT(added_at, '%Y-%m-%d'), ', At: ', DATE_FORMAT(added_at, '%H:%i')) AS formatted_added_at FROM ExitEntryMedHistory \
   INNER JOIN Drug_stock ON ExitEntryMedHistory.product_id = Drug_stock.product_id \
   INNER JOIN users ON ExitEntryMedHistory.uid = users.id \
   WHERE ExitEntryMedHistory.type = 'Enter'";

  pool.query(joinQuery, (err, result) => {
    if (err) {
      res.sendStatus(200).send({ message: "Error" });
    } else {
      res.send(result);
    }
  });
});

MedRouter.route("/History/Removal").get((req, res) => {
  const joinQuery =
    "SELECT fname, lname, product_name, ExitEntryMedHistory.quantity, type, FlightNum, CONCAT(DATE_FORMAT(added_at, '%Y-%m-%d'), ', At: ', DATE_FORMAT(added_at, '%H:%i')) AS formatted_added_at FROM ExitEntryMedHistory \
   INNER JOIN Drug_stock ON ExitEntryMedHistory.product_id = Drug_stock.product_id \
   INNER JOIN users ON ExitEntryMedHistory.uid = users.id \
   WHERE ExitEntryMedHistory.type = 'Remove'";

  pool.query(joinQuery, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(200).send({ message: "Error" });
    } else {
      res.send(result);
    }
  });
});

MedRouter.route("/Stock").get((req, res) => {
  pool.query(
    "SELECT COUNT(*) FROM Drug_stock WHERE quantity = 0",
    (err, response) => {
      if (err) {
        res.send(err);
      } else {
        res.send(response);
      }
    }
  );
});

MedRouter.route("/Out_Of_Stock").get((req, res) => {
  const query = `Select * from Drug_Stock WHERE Quantity = 0`;
  pool.query(query, (err, response) => {
    if (err) {
      res.send(err);
    } else {
      res.send(response);
    }
  });
});

MedRouter.route("/Expired").get((req, res) => {
  const { days } = req.params;
  const query = `SELECT * Drug_stock where Date_Of_Expiry = 'Expired'`;

  pool.query(query, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send({ result: result, exp: days });
    }
  });
});

MedRouter.route("/GetOrderItems").post((req, res) => {
  const query = "SELECT * FROM Drug_stock WHERE product_id IN (?)";
  const productIds = req.body.item;

  pool.query(query, productIds, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

MedRouter.route("/getProduct/:ID").get((req, res) => {
  const query = "SELECT product_name FROM Drug_stock WHERE product_id = ?";

  pool.query(query, req.params.ID, (err, result) => {
    if (err) {
      res.status(500).send({ message: "Error Fetching product name" });
    } else {
      res.status(200).send(result);
    }
  });
});

MedRouter.route("/TotalStock").get((req, res) => {
  const query = "SELECT COUNT(*) AS total FROM Drug_stock";

  pool.query(query, (err, result) => {
    if (err) {
      res.status(500).send({ error: "Error fetching total stock count" });
    } else {
      res.status(200).send(result);
    }
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

MedRouter.route("/StockRemoval").put((req, res) => {
  const updatedVal = req.body.currentQty - req.body.RemovalQty;
  const query = `UPDATE Drug_stock SET Quantity = ${updatedVal} 
  WHERE product_id = ${req.body.productID}`;

  pool.query(query, (err, result) => {
    if (err) {
      res.send({ message: "error " + err });
    } else {
      res.send({ message: req.body.productName + " has been updated." });
    }
  });
});

MedRouter.route("/StockUpdate").put((req, res) => {
  const updatedVal =
    parseInt(req.body.currentQty) + parseInt(req.body.RemovalQty);
  const query = `UPDATE Drug_stock SET Quantity = ${updatedVal} 
  WHERE product_id = ${req.body.productID}`;

  pool.query(query, (err, result) => {
    if (err) {
      res.send({ message: "error " + err });
    } else {
      res.send({ message: req.body.productName + " has been updated." });
    }
  });
});

MedRouter.route("/StockUpdateMission/:ID").put((req, res) => {
  const query = "SELECT quantity FROM Drug_stock WHERE product_id = ?";
  pool.query(query, req.params.ID, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      const productOldQty = result[0].quantity;
      const productRemoveQty = req.body.quantity;
      const newQty = productOldQty - productRemoveQty;

      const updateStockQuery = `UPDATE Drug_stock SET quantity = ${newQty} WHERE product_id = ? `;
      pool.query(updateStockQuery, req.params.ID, (error, resposne) => {
        if (error) {
          res.send({ message: "Error Updating the value" }).status(500);
        } else {
          const insertIntoERHistoryQuery =
            "INSERT INTO ExitEntryMedHistory(product_id, uid, quantity, FlightNum, type, added_at) VALUES (?,?,?,?,?,?)";

          const currentDate = new Date();

          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, "0");
          const day = String(currentDate.getDate()).padStart(2, "0");
          const formattedDate = `${year}-${month}-${day}`;

          pool.query(
            insertIntoERHistoryQuery,
            [
              req.params.ID,
              1684438793,
              productRemoveQty,
              req.body.flightNumber,
              "Remove",
              formattedDate,
            ],
            (ErERR, ErResult) => {
              if (ErERR) {
                res.status(500);
              } else {
                res.status(200);
              }
            }
          );
        }
      });
    }
  });
});

MedRouter.route("/StockEntries").post((req, res) => {
  const query =
    "INSERT INTO ExitEntryMedHistory (product_id, uid, quantity, FlightNum,type, added_at) VALUES \
    ((SELECT product_id FROM Drug_stock WHERE product_name = ? LIMIT 1), ?, ?, ' ', ?, CURRENT_DATE)";

  const { product_name, uid, quantity, type } = req.body.data;

  pool.query(query, [product_name, uid, quantity, type], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error occurred while inserting data." });
      console.log(err);
    } else {
      res.status(200).json({ message: "Data inserted successfully." });
    }
  });
});

MedRouter.route("/EntryExit/:type").get((req, res) => {
  let query = "SELECT product_name, product_type,ExitEntryMedHistory.quantity";

  if (req.params.type === "Remove") {
    query += ", FlightNum";
  }

  query +=
    ", CONCAT(DATE_FORMAT(added_at, '%Y-%m-%d'), ', At: ', DATE_FORMAT(added_at, '%H:%i')) AS formatted_added_at \
    FROM ExitEntryMedHistory \
    INNER JOIN Drug_stock ON ExitEntryMedHistory.product_id = Drug_stock.product_id WHERE type = ?";

  pool.query(query, req.params.type, (err, result) => {
    if (err) {
      res.status(500).send({ Error: "Error Fetching" });
    } else {
      res.status(200).send({ message: "Success", payload: result });
    }
  });
});

MedRouter.route("/UpdateEvent").post((req, res) => {
  const query =
    "INSERT INTO ExitEntryMedHistory(product_id, uid, quantity, FlightNum, type) VALUES (?, ?, ?, ?, ?)";

  pool.query(query, req.body.data, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error updating event");
    } else {
      console.log("Event updated successfully");
      res.sendStatus(200);
    }
  });
});

MedRouter.route("/DateEntered/:ProductID").get((req, res) => {
  const query =
    "SELECT DATE_FORMAT(added_at, '%Y-%m-%d') AS dateAdded FROM ExitEntryMedHistory WHERE product_id = ?";

  pool.query(query, req.params.ProductID, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.status(200).send(result);
    }
  });
});

MedRouter.route("/DeleteItem/:ID").delete((req, res) => {
  const query = "DELETE FROM Drug_stock WHERE product_id = ?";

  pool.query(query, req.params.ID, (err, result) => {
    if (err) {
      if (err.errno == 1451) {
        res.send({ message: `${req.query.productName} Cannot Be Removed` });
      }
    } else {
      res
        .status(200)
        .send({ message: `${req.query.productName} has been removed` });
    }
  });
});

MedRouter.route("/Search/:Value").get((req, res) => {
  const query = "SELECT * FROM Med_stock WHERE product_id = ? ";

  pool.query(query, req.params.Value, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.status(200).send(result);
    }
  });
});

export default MedRouter;
