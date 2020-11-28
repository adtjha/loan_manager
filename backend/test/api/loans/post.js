process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const request = require("supertest");

const User = require("../../../db/models/user.model");

const app = require("../../../server.js");
const conn = require("../../../db/index.js");

let user_id, loan_id;

describe("POST /loans", () => {
  before((done) => {
    conn
      .connect()
      .then(() => {
        User.create(
          {
            name: "pradeep",
            pass: "MrSafepass",
            category: "customer",
          },
          (err, doc) => {
            if (err) {
              console.log("Error creating documents in beforeEach: " + err);
              throw err;
            }
            user_id = doc._id;
            done();
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
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property("_id");
        expect(body).to.contain.property("user");
        expect(body).to.contain.property("status");
        body.history.forEach((e) => {
          expect(e).to.have.all.keys(["state", "time"]);
        });
        expect(body.particulars).to.have.property("emi", 422);
        loan_id = res.body._id;
        done();
      })
      .catch((err) => done(err));
  });

  it("OK, Approving a Loan which exsists", (done) => {
    request(app)
      .post("/loan/approve/" + loan_id)
      .then((res) => {
        const body = res.body;
        expect(body.history).to.be.an.instanceOf(Array);
        body.history.forEach((e) => {
          expect(e).to.have.all.keys(["state", "time"]);
        });
        done();
      })
      .catch((err) => done(err));
  });
});
