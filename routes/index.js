"use strict";

const express = require('express');
const router  = express.Router();
const addToPoll   = require('../poll');
const initialMailgun     = require("../public/scripts/initialMailgun");

module.exports = (knex) => {

  router.get("/", (req, res) => {
    res.render("index");
  });

  router.post("/", (req, res) => {
    // posts create form data to database
    const adminID = generateRandomString();
    const userID = generateRandomString();
    let optionArray = [];

    const newPoll = {
     email: req.body.email,
     title: req.body.title,
     adminUrl: adminID,
     userUrl: userID,
     voteCount: 0
    }

    for (let i = 1; i <= 6; i++){
      let currOption = "option" + i;
      let currDescript = "description" + i;
      if (req.body[currOption]) {
        let option = {
          option: req.body[currOption],
          description: req.body[currDescript],
          submitCount: 0
        }
        optionArray.push(option);
      } else {
        break;
      }
    }
    addToPoll(newPoll, optionArray);
    initialMailgun(req.body.email, req.body.title, adminID, userID);
  });


  return router;
}

function generateRandomString() {
  const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  let rand = '';

  for (let i = 0; i < 10; i ++) {
    rand += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return rand;
}
