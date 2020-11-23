const router = require("express").Router();
let Loan = require("../models/loan.model");

router.route("/").get((req, res) => {
  Loan.find()
    .then((Loan) => res.json(Loan))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/").post((req, res, next) => {
  // create loan from data.
  const customer = req.body.customer;
  const provider = req.body.provider;
  const particulars = req.body.particulars;
  const purpose = req.body.purpose;
  const status = "NEW";

  const newLoan = new Loan({
    customer,
    provider,
    particulars,
    purpose,
    status,
  });

  newLoan
    .save()
    .then(() => {
      res.json("Loan Created");
      next();
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/approve/:_id").post((req, res) => {
  // Only approve loan if user is admin
});

router.route("/:_id").get((req, res) => {
  // Only approve loan if user is admin
});

module.exports = router;
