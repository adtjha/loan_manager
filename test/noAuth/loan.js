process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const request = require("supertest");

const Crypto = require("crypto");
const app = require("../../server.js");
const conn = require("../../db/index.js");
const User = require("../../db/models/user.model");
const Loan = require("../../db/models/loan.model");

let user_id, loan_id;

describe("Testing /loan endpoints, without Auth Token", () => {
  before((done) => {
    conn.connect().then(() => {
      // Creating agent,
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
      .end((err, res) => {
        const body = res.body;
        expect(body).to.contain("Token is required");
      });
    done();
  });

  // Get loan without accessToken
  it("OK, Get Info of selected Loan", (done) => {
    request(app)
      .get(`/loan/${loan_id}`)
      .end((err, res) => {
        const body = res.body;
        expect(body).to.contain("Token is required");
      });
    done();
  });

  // Approve Loan without accessToken
  it("OK, Approving a Loan which exsists", (done) => {
    request(app)
      .post("/loan/approve/" + loan_id)
      .end((err, res) => {
        const body = res.body;
        expect(body).to.contain("Token is required");
      });
    done();
  });

  // Delete Loan without accessToken
  it("OK, Delete Selected Loan with ID provided", (done) => {
    request(app)
      .delete("/loan/" + loan_id)
      .end((err, res) => {
        const body = res.body;
        expect(body).to.contain("Token is required");
      });
    done();
  });
});
