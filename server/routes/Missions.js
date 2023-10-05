import express, { query, response } from "express";
import mysql from "mysql2";

const app = express();
const port = 3000;

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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MAKE AN ALGO THAT RECOMENDS MATERIAL BASED ON THE FLIGHT LENGTH PATIENT CONDITION AND DIFFERENT FACTORS IN A FUTURE UPDATE //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const MissionRouter = express.Router();

MissionRouter.route("/FlightsPerPlane").get((req, res) => {
  const query =
    "SELECT call_sign ,COUNT(DISTINCT flight_num) AS NumberOfFlights FROM missions GROUP BY call_sign";

  pool.query(query, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.send(result).status(200);
    }
  });
});

MissionRouter.route("/")
  .post((req, res) => {
    const query = `
    INSERT INTO Missions(product_id, uid, call_sign, status, flight_num, quantity ,DateCreated, MissionDate, Depart, Arrive)
    VALUES(49, 1684438792, "CN-TME", 0, "AOM-158", 3, CURRENT_DATE(), '2023-09-25', 'CMN', 'YUL');
  `;

    pool.query(query, (err, result) => {
      if (err) {
        res.status(500);
      } else {
        res.status(200).send({ message: "Success" });
      }
    });
  })
  .get((req, res) => {
    const query = "SELECT mission_data FROM missions";

    pool.query(query, (err, result) => {
      if (err) {
        res.status(500).send("Internal Server Error");
      } else {
        res.status(200).send(result);
      }
    });
  });

MissionRouter.route("/PieChart").get((req, res) => {
  //Only do the ones for each year OR each month.
  const query =
    "SELECT DISTINCT COUNT(*) AS Missions FROM Missions WHERE YEAR(MissionDate) = YEAR(CURDATE())";

  pool.query(query, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.send(result).status(200);
    }
  });
});

MissionRouter.route("/Active").get((req, res) => {
  const query =
    "SELECT flight_num, DATE_FORMAT(MissionDate, '%Y/%m/%d') AS FormattedDate, Depart, Arrive FROM Missions \
   WHERE status = 1 GROUP BY flight_num ";

  pool.query(query, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.status(200).send(result);
    }
  });
});

MissionRouter.route("/:flightNum").get((req, res) => {
  const query =
    "SELECT product_name, Missions.quantity FROM Missions \
    INNER JOIN Drug_stock ON Drug_stock.product_id = Missions.product_id \
    WHERE flight_num = ?";

  pool.query(query, req.params.flightNum, (err, result) => {
    if (err) {
      res.status(500).send({ message: err });
    } else {
      res.status(200).send(result);
    }
  });
});

MissionRouter.route("/NewMission").post((req, res) => {

  const query = `INSERT INTO missions(mission_data) VALUES (?)`;

  pool.query(query, req.body.data, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.status(200).send({ message: "Insert Success" });
    }
  });
});

function countDrugs(drugs) {
  //linear search can use a hashmap to get O(log(n))

  for (let i = 0; i < drugs.length; i++) {
    for (let j = 0; j < i; i++) {}
  }
}

//Remove the out of stock ting in the home box for a circle graph of the entries and removals this month.
// Or approaching expiry date.
