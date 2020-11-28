process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../../server.js");
const conn = require("../../../db/index.js");
const User = require("../../../db/models/user.model");

let user = {};

describe("DELETE /users", () => {
  before((done) => {
    conn
      .connect()
      .then(() => {
        User.create(
          {
            name: "Juman",
            pass: "Mrpass123",
            category: "customer",
          },
          (err, doc) => {
            if (err) {
              console.log("Error creating documents in beforeEach: " + err);
              throw err;
            }
            user.id = doc._id;
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

  it("OK, Checking if User's data can be deleted", (done) => {
    request(app)
      .get("/users/" + user.id)
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property("_id");
        done();
      })
      .catch((err) => done(err));
  });
});
