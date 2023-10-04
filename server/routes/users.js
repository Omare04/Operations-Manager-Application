import express, { query, response } from "express";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const router = express.Router();
router.use(express.json());

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));

//this configures our environment file .env
dotenv.config();

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


export async function getUser(id) {
  try {
    const [rows] = await pool.query(
      "SELECT * users where id = ?",
      id,
      (err, res) => {
        if (err) {
          return err;
        } else {
          return res;
        }
      }
    );
    return rows;
  } catch (e) {
    throw e;
  }
}

router.route("/MedicalCrew").get((req, res) => {
  const query = "SELECT email, id FROM users ";
  pool.query(query, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.status(200).send(result);
    }
  });
});

//This function generates an access token based on the user payload that will be serialized in the token.
//exp: 5mins
function genAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5m" });
}

//This function is used to generate a access token and returns it.
//exp: 1d
function genRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
}

//This function is used as MIDDLEWARE to authenticate the users token.
function authToken(req, res, next) {
  //the token taken from the header will be brought up from the validateRefreshToken() function
  //which will create a new access token.

  //The header name will be called authorization
  const authHeader = req.headers["authorization"];
  //And since the header value is Bearer: token we need to retrieve the 2nd
  //Value of that header which is our token.
  const token = authHeader && authHeader.split(" ")[1];

  //If the user does not have access.
  if (token == null) {
    res.sendStatus(401).send({ message: "You do not have access" });
  }

  //Now that the token is confirmed to have some value, you compare it against our own secret token
  //If the tokens match, we can return the user, which is our result case called (user)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      //This error code sees that you have a token, but the token is invalid and now the permission access is changed to
      //Forbidden
      return res.sendStatus(403);
    } else {
      req.user = user;
      //This next() function moves on from the middleware and procceeds to the HTTP request werem we implemented that middleware
      next();
    }
  });
}

function setRefreshToken(token, user) {
  return new Promise((resolve, reject) => {
    const insertQuery =
      "INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)";
    const values = [user["id"], token];

    pool.query(insertQuery, values, (err, insertResult) => {
      if (err) {
        reject(err);
        console.log(err);
      } else {
        resolve(insertResult);
      }
    });
  });
}

router.use(
  cors({
    origin: "http://localhost:5173",
    method: ["GET", "POST"],
    credentials: true,
  })
);

router.use(
  session({
    key: "userId",
    secret: "bloobsecretmonkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

//To register the user
router
  .route("/")
  .post(async (req, res) => {
    try {
      const fname = req.body.fname;
      const lname = req.body.lname;
      const email = req.body.email;
      const password = req.body.password;
      const position = req.body.position;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const query = `INSERT INTO users (fname, lname, email, password, position)
                   VALUES ('${fname}', '${lname}', '${email}', '${hashedPassword}', '${position}')`;

      pool.query(query, (err, results) => {
        if (err) {
          res.send(err);
        } else {
          res.send(results);
        }
      });
    } catch (error) {
      res.send(error);
    }
  })
  .get((req, res) => {
    const query = "SELECT * FROM users";
    pool.query(query, (err, result) => {
      if (err) {
        res.send(err);
      } else {
      }
    });
  });

//Route to Authenticate the user
router
  .route("/login")
  .post((req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const query = "SELECT * FROM users WHERE email = ?";

    pool.query(query, email, (err, result) => {
      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (err, resultpass) => {
          if (err) {
            res.send(err);
            return;
          }
          if (resultpass) {
            const user = {
              id: result[0].id,
              fname: result[0].fname,
              lname: result[0].lname,
              email: result[0].email,
            };

            const accessToken = genAccessToken(user);
            const refreshToken = genRefreshToken(user);

            res.cookie("userSession", refreshToken, {
              httpOnly: true,
            });

            //This function sets the users refresh token accompanied with the users id
            setRefreshToken(refreshToken, user)
              .then(() => {
                res.send({
                  loggedIn: true,
                  message: "Login Successful",
                });
              })
              .catch((err) => {
                res
                  .status(500)
                  .send("Error occurred while setting refresh token");
              });

            return; // Terminate the request-response cycle
          } else {
            res.send({
              message:
                "The Username/Password you've entered is incorrect, please try again.",
              loggedIn: false,
              user: result,
            });
            return;
          }
        });
      } else {
        res.send({ message: "This user does not exist" });
        return;
      }
    });
  })
  //the get request takes in the middleware which authenticates the users. It returns a success message
  //If the middleware (authtoken) has been successful
  .get(authToken, (req, res) => {
    //This sets the request headers value to the token we retrieve from the
    //Client using http only cookie, which is set in the login POST request.
    //Because in the login router POST we've already set the refresh token as our cookie.
    const token = req.headers["Authorization"];
    res.set("Authorization", token);
    //Now that everything has been checked, here is where we send down the user information that we need.
    //so the get request for the route login will be used to retriev the users information.
    res.send(req.user);
    return res.json("Authenticated");
    // }
  });

//We will be calling this route everytime we need to request the infomation of the user or
//To verify if the user is still logged in.
router.route("/token").post((req, res) => {
  //This refresh token will be the token from the cookie
  const refreshToken = req.body.token;

  if (refreshToken == "null") {
    return res.send({ loggedIn: false });
  } else {
    //This needs a query that checks if the refresh token is valid good or removed.
    //Query to the db to retrieve the refresh token
    pool.query(
      "SELECT token from refresh_tokens WHERE token = ?",
      refreshToken,
      (err, result) => {
        if (err) {
          res.send(err);
        } else {
          if (result.length > 0) {
            validateRefreshToken(refreshToken)
              .then((user) => {
                let users = [
                  {
                    id: user.id,
                    fname: user.fname,
                    lname: user.lname,
                    email: user.email,
                  },
                ];
                const accessToken = genAccessToken({ user: users });
                res.json({ accessToken: accessToken, user: users });
              })
              .catch(() => {
                res.sendStatus(403);
              });
          } else {
            res.sendStatus(403);
          }
        }
      }
    );
  }
});

//This function takes in a refresh token that has been retrieved from our database
//and uses the jwt.verify() function to verify it against the env refresh token secret
function validateRefreshToken(refreshToken) {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        //If the refresh token is not valid you'll automatically remove it from the database and refresh the application
        reject(err);
      } else {
        //This returns the user object if the verification is resolved
        resolve(user);
      }
    });
  });
}

//This allows us to delete the refresh token to allow us to logout
//Unsetting the refresh token and removing that users session
router.route("/logout").delete((req, res) => {
  const query = "DELETE FROM refresh_tokens WHERE token = ?";
  pool.query(query, req.query.token, (err, result) => {
    if (err) {
      return res.sendStatus(401);
    } else {
      console.log("mission complete");
      return res
        .status(204)
        .send({ message: "Token Deleted", loggedIn: false });
    }
  });
});

router.route("/:id").get((req, res) => {
  const id = req.params.id;
  const query = "SELECT email, phoneNumber FROM users WHERE id = ?";

  pool.query(query, [id], (error, results) => {
    if (error) {
      // Handle the error
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    } else {
      res.json(results);
    }
  });
});


export default router;
