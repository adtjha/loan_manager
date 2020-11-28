const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const conn = require("./db/index");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

conn.connect();

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.use(cors());
app.use(express.json());

const loanRouter = require("./routes/loan");
const usersRouter = require("./routes/users");

app.use("/loan", loanRouter);
app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

module.exports = app;
