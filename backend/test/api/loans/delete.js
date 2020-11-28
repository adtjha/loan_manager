process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const request = require("supertest");

const User = require("../../../db/models/user.model");
const Loan = require("../../../db/models/loan.model");

const app = require("../../../server.js");
const conn = require("../../../db/index.js");

let user_id, loan_id;

describe("DELETE /loans", () => {
  before((done) => {
    conn
      .connect()
      .then(() => {
        User.create(
          {
            name: "Prateek",
            pass: "HMmm456",
            category: "customer",
          },
          (err, doc) => {
            if (err) throw err;
            user_id = doc._id;
            Loan.create(
              {
                user: user_id,
                particulars: {
                  amount: "8000",
                  rate: "4",
                  tenure: "6",
                  payments: [],
                },
                purpose: "Personal Expense purpose",
                status: "NEW",
              },
              (err, doc) => {
                if (err) throw err;
                loan_id = doc._id;
                done();
              }
            );
          }
        );
      })
      .catch((err) => done(err));
  });

  after((done) => {
    conn
      .close()
      .then(() => done())
      .catch((err) => done(err));
  });

  it("OK, Delete Selected Loan with ID provided", (done) => {
    request(app)
      .delete("/loan/" + loan_id)
      .then((res) => {
        const body = res.body;
        expect(body.n).to.equal(body.deletedCount);
        expect(body.ok).to.equal(1);
        done();
      })
      .catch((err) => done(err));
  });
});
