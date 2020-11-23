const router = require("express").Router();
let Loan = require("../models/loan.model");

router.route("/").get((req, res) => {
  Loan.find()
    .then((Loan) => res.json(Loan))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
