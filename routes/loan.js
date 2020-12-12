const router = require("express").Router();
let Loan = require("../db/models/loan.model");
let User = require("../db/models/user.model");
const moment = require("moment");

const authenticate = require("../jwt/authenticate");

router.get(
  "/",
  // authenticate({ scope: "read all loan profiles" }),
  (req, res) => {
    Loan.find()
      .select("particulars _id status user")
      .populate("user", "_id name category")
      .then((Loan) => res.json(Loan))
      .catch((err) => res.status(400).json("Error: " + err));
  }
);

router.post(
  "/",
  authenticate({ scope: "create/update/delete loan profile" }),
  (req, res, next) => {
    // create loan from data.
    const user = req.body.user;
    const particulars = req.body.particulars;
    const purpose = req.body.purpose;
    const status = "NEW";

    const newLoan = new Loan({
      user,
      particulars,
      purpose,
      status,
    });

    newLoan
      .save()
      .then((doc) => {
        // Update specific user model with id of the loan.
        const loan = doc._id;
        User.findById(doc.user, function (err, doc) {
          if (err && loan) res.status(500).json(err);
          doc.loans.push(loan);
          doc.save(function (err, doc) {
            if (err) res.status(500).json(err);
            // res.status(200).json(doc);
          });
        });
        res.status(200).json(doc);
        next();
      })
      .catch((err) => res.status(500).json("Error: " + err));
  }
);

router.post(
  "/approve/:id",
  authenticate({ scope: "approve loan profile" }),
  (req, res) => {
    // Only approve loan if user is admin
    const id = req.params.id;
    Loan.findById(id, function (err, loan) {
      if (err) res.status(500).json(err);
      // loan.status = "APPROVED";
      loan.history.push({ state: loan.status, time: moment().format("LLLL") });
      loan.save(function (err, doc) {
        if (err) res.status(500).json(err);
        res.status(200).json(doc);
      });
    });
  }
);

router.get(
  "/:id",
  authenticate({ scope: "read single loan profile" }),
  (req, res) => {
    // Only approve loan if user is admin
    const id = req.params.id;
    Loan.findOne({ _id: id }, function (err, loan) {
      if (err) res.status(500).json(err);
      res.status(200).json(loan);
    });
  }
);

router.delete(
  "/:id",
  authenticate({ scope: "create/update/delete loan profile" }),
  (req, res) => {
    // Only approve loan if user is admin
    const id = req.params.id;
    Loan.deleteOne({ _id: id }, function (err, result) {
      if (err) res.status(500).json(err);
      res.status(200).json(result);
    });
  }
);

module.exports = router;
