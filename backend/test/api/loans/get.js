process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const request = require("supertest");

const User = require("../../../db/models/user.model");
const Loan = require("../../../db/models/loan.model");

const app = require("../../../server.js");
const conn = require("../../../db/index.js");

let user_id, loan_id;

describe("GET /loans", () => {
  before((done) => {
    conn
      .connect()
      .then(() => {
        User.create(
          {
            name: "Chacha",
            pass: "HeMan456",
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

  it("OK, Get Info of selected Loan", (done) => {
    request(app)
      .get("/loan/" + loan_id)
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property("_id");
        expect(body).to.contain.property("user");
        expect(body).to.contain.property("status");
        expect(body.particulars).to.have.property("emi");
        body.history.forEach((e) => {
          expect(e).to.have.all.keys(["state", "time"]);
        });
        done();
      })
      .catch((err) => done(err));
  });
});
