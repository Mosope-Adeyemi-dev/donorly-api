const express = require("express");
const morgan = require("morgan");
const { readdirSync } = require("fs");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

readdirSync("./routes").map(async (routeFile) => {
  app.use("/api/v1", await require(`./routes/${routeFile}`));
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: "Active",
  });
});

module.exports = app;


/**
 * My previous research has focused on developing models to detect fraudulent transactions in financial transactions. Using machine learning algorithms, specifically supervised learning techniques such as logistic regression, and random forests, to identify patterns in the data that are indicative of fraudulent activity.

I have not yet received any research funding. However, I am fully committed to working hard to gain the necessary knowledge and skills to conduct innovative research in this area. 
 * 
 * 
 * 
 * Your research in using VR/AR to present, explore, and analyze data is particularly intriguing to me. The idea of turning any physical space into a data display and immersing users in simulated scenarios is something that I find truly innovative and exciting.

I am excited about the potential of your research to contribute to this rapidly evolving field, and I believe that I can make a valuable contribution to your team.
 */