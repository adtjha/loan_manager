process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const request = require("supertest");

const Crypto = require("crypto");
const app = require("../../server.js");
const conn = require("../../db/index.js");
const User = require("../../db/models/user.model");
const Loan = require("../../db/models/loan.model");

let user_id,
  loan_id,
  admin_id,
  token = {};

describe("Testing /loan endpoints, with Auth Token", () => {
  before((done) => {
    conn.connect().then(() => {
      // Creating agent,
      User.create(
        {
          name: "adtjha",
          pass: "@123adtjha",
          category: "admin",
          secret: Crypto.randomBytes(21).toString("base64").slice(0, 21),
        },
        (err, doc) => {
          admin_id = doc._id;
          request(app)
            .post("/users/verify")
            .send({
              name: "adtjha",
              pass: "@123adtjha",
            })
            .end((err, res) => {
              if (err) throw new Error(err);
              token.admin = res.accessToken;
            });
        }
      );
      User.create(
        {
          name: "Vinod",
          pass: "saifali",
          category: "agent",
          secret: Crypto.randomBytes(21).toString("base64").slice(0, 21),
        },
        (err, doc) => {
          if (err) {
            console.log("Error creating documents in beforeEach: " + err);
            throw err;
          }
          user_id = doc._id;
          request(app)
            .post("/users/verify")
            .send({
              name: "Vinod",
              pass: "saifali",
            })
            .end((err, res) => {
              if (err) throw new Error(err);
              token.agent = res.accessToken;
            });
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
            }
          );
        }
      );
    });
    done();
  });

  after((done) => {
    conn
      .close()
      .then()
      .catch((err) => {
        throw err;
      });
    done();
  });

  // Post Loan without accessToken
  it("OK, Checking if Loans is created", (done) => {
    request(app)
      .post("/loan/")
      .send({
        user: user_id,
        particulars: {
          amount: "5000",
          rate: "2",
          tenure: "12",
          payments: [],
        },
        purpose: "Education purpose",
      })
      .set("Authorization", `Bearer ${token.agent}`)
      .end((err, res) => {
        const body = res.body;
        expect(body).to.contain.property("_id");
        expect(body).to.contain.property("user");
        expect(body).to.contain.property("status");
        body.history.forEach((e) => {
          expect(e).to.have.all.keys(["state", "time"]);
        });
        expect(body.particulars).to.have.property("emi", 422);
        loan_id = res.body._id;
      });
    done();
  });

  // Get loan without accessToken
  it("OK, Get Info of selected Loan", (done) => {
    request(app)
      .get(`/loan/${loan_id}`)
      .set("Authorization", `Bearer ${token.agent}`)
      .end((err, res) => {
        const body = res.body;
        expect(body).to.contain.property("_id");
        expect(body).to.contain.property("user");
        expect(body).to.contain.property("status");
        expect(body.particulars).to.have.property("emi");
        body.history.forEach((e) => {
          expect(e).to.have.all.keys(["state", "time"]);
        });
      });
    done();
  });

  // Approve Loan without accessToken
  it("OK, Approving a Loan which exsists", (done) => {
    request(app)
      .post("/loan/approve/" + loan_id)
      .set("Authorization", `Bearer ${token.admin}`)
      .end((err, res) => {
        const body = res.body;
        expect(body.history).to.be.an.instanceOf(Array);
        body.history.forEach((e) => {
          expect(e).to.have.all.keys(["state", "time"]);
        });
      });
    done();
  });

  // Delete Loan without accessToken
  it("OK, Delete Selected Loan with ID provided", (done) => {
    request(app)
      .delete("/loan/" + loan_id)
      .set("Authorization", `Bearer ${token.agent}`)
      .end((err, res) => {
        const body = res.body;
        expect(body.n).to.equal(body.deletedCount);
        expect(body.ok).to.equal(1);
      });
    done();
  });
});
