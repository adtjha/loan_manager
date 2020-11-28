process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../../server.js");
const conn = require("../../../db/index.js");
const User = require("../../../db/models/user.model");

let user = {
  id: "",
  name: "",
};

describe("PATCH /users", () => {
  before((done) => {
    conn
      .connect()
      .then(() => {
        User.create(
          {
            name: "Sandeep",
            pass: "Mrpass",
            category: "customer",
          },
          (err, doc) => {
            if (err) {
              console.log("Error creating documents in beforeEach: " + err);
              throw err;
            }
            user.id = doc._id;
            user.name = doc.name;
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

  it("OK, Checking if User's name can be patched", (done) => {
    request(app)
      .patch("/users/" + user.id + "/Aman")
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property("n");
        expect(body).to.contain.property("nModified");
        expect(body.n).to.equal(1);
        expect(body.nModified).to.equal(1);
        done();
      })
      .catch((err) => done(err));
  });
});
