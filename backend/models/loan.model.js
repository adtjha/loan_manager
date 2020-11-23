const mongoose = require("mongoose");
const moment = require("moment");

const Schema = mongoose.Schema;

const loanSchema = new Schema(
  {
    customer: {
      name: { type: String, required: true },
      id: { type: Schema.Types.ObjectId, required: true },
    },
    provider: {
      name: { type: String, required: true },
      id: { type: String, required: true },
    },
    particulars: {
      amount: { type: Number, required: true },
      rate: { type: Number, required: true },
      tenure: { type: Number, required: true },
      emi: {
        paid: { type: Number, required: true },
        current: { type: Number, required: true },
      },
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
  let r = loan.particulars.rate,
    p = loan.particulars.amount,
    n = loan.particulars.tenure;
  r = r / (100 * n);
  var pow = Math.pow(1 + r, n);
  var top = p * r * pow;
  var bottom = pow - 1;
  loan.particulars.emi.current = Math.ceil(top / bottom);
  loan.history.push({ state: loan.status, time: moment().format("LLLL") });
  next();
});

loanSchema.method("rollback", function (next) {
  //ROLBACK UPDATES.
});

const loan = mongoose.model("loan", loanSchema);

module.exports = loan;

/**
 * {
    customer: {
      name: chacha,
      uid: 5fb76109d2f54e16b092b708,
    },
    provider: {
      issued_by: {
        user_name: BabaRam,
        user_id: 5fbbd6ff3e0bf2219403772c,
      },
    },
    particulars: {
      issued_on: 22/11/2020,
      amount: 5000,
      rate: 2,
      tenure: 12,
      emi: { paid: 2},
    },
    loan_purpose: "Education purpose",
  }
 */
