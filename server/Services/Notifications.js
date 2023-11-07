import express from "express";


const NotificationRoute = express.Router();

NotificationRoute.route("/").post((req,res) => {

    //Output stream
    
    const users = [req.body.data];

    users.forEach((element, i) => {
        //post the mission for each, Or send it using Whatsapps api and send it to the EVASAN groupChat. 
    });


})



