const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const loanSchema = new Schema(
  {
    borrower: {
      name: { type: String, required: true },
      uid: { type: Schema.Types.ObjectId, required: true },
    },
    provider: {
      issued_by: {
        name: { type: String, required: true },
        uid: { type: String, required: true },
      },
    },
    particulars: {
      issued_on: { type: Date, required: true },
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

loanSchema.method("emi", function (next) {
  const loan = this;
  let r = loan.rate,
    p = loan.amount,
    n = loan.tenure;
  r = r / (100 * n);
  var pow = Math.pow(1 + r, n);
  var top = p * r * pow;
  var bottom = pow - 1;
  loan.particulars.emi.current = Math.ceil(top / bottom);
  next();
});

loanSchema.method("rollback", function (next) {
  //ROLBACK UPDATES.
});

const loan = mongoose.model("loan", loanSchema);

module.exports = loan;

/**
 * {
 *  loan_id: 5fb76109d2f54e16b092b708,
    loan_borrower: {
      name: chacha,
      uid: 5fb76109d2f54e16b092b708,
    },
    loan_provider: {
      issued_by: {
        user_name: satish,
        user_id: 5fb76109d2f54e16b092b708,
      },
    },
    loan_particulars: {
      issued_on: 22/11/2020,
      amount: 5000,
      rate: 2,
      tenure: 12,
      emi_paid: 2,
    },
    loan_purpose: "Education purpose",
    loan_status: "NEW",
    loan_history: [
      "New": '12/11/2020',
    ],
  }
 */
