process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../../server.js");
const conn = require("../../../db/index.js");

describe("POST /users", () => {
  before((done) => {
    conn
      .connect()
      .then(() => done())
      .catch((err) => done(err));
  });

  after((done) => {
    conn
      .close()
      .then(() => done())
      .catch((err) => done(err));
  });

  it("OK, Checking if User is created", (done) => {
    request(app)
      .post("/users/")
      .send({
        name: "gambino",
        pass: "heKnowSafe",
        category: "customer",
      })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property("_id");
        expect(body).to.contain.property("name");
        expect(body).to.contain.property("pass");
        expect(body).to.contain.property("category");
        done();
      })
      .catch((err) => done(err));
  });

  it("OK, Checking if User is autherised by using password as credentials", (done) => {
    request(app)
      .post("/users/auth")
      .send({
        name: "gambino",
        pass: "heKnowSafe",
      })
      .then((res) => {
        const body = res.body;
        expect(body).to.equal(true, "User is Autherised");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
