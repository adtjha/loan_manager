const mongoose = require("mongoose");
const moment = require("moment");
let User = require("./user.model");

const Schema = mongoose.Schema;

const loanSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    particulars: {
      amount: { type: Number, required: true },
      rate: { type: Number, required: true },
      tenure: { type: Number, required: true },
      emi: { type: Number },
      payments: [],
    },
    purpose: { type: String, required: true },
    status: { type: String, required: true },
    history: [],
  },
  {
    timestamps: true,
  }
);

loanSchema.pre("save", function (next) {
  const loan = this;
  try {
    let r = loan.particulars.rate,
      p = loan.particulars.amount,
      n = loan.particulars.tenure;
    r = r / (100 * n);
    var pow = Math.pow(1 + r, n);
    var top = p * r * pow;
    var bottom = pow - 1;
    // setting EMI
    loan.particulars.emi = Math.ceil(top / bottom);
    // storing the history.
    loan.history.push({ state: loan.status, time: moment().format("LLLL") });
    loan.save();
    next();
  } catch (error) {
    return next(error);
  }
});

loanSchema.method("rollback", function (status, next) {
  //ROLBACK UPDATES.
});

const loan = mongoose.model("loan", loanSchema);

module.exports = loan;

/**
 * {
    "customer": {
        "user": "5fbce5bc4ae73801745a748c"
    },
    "provider": {
        "user": "5fbce5844ae73801745a748b"
    },
    "particulars": {
      "amount": "5000",
      "rate": "2",
      "tenure": "12",
      "payments": []
    },
    "purpose": "Education purpose"
  }
 */
