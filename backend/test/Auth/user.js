process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const assert = require("chai").assert;
const request = require("supertest");

const Crypto = require("crypto");
const app = require("../../server.js");
const conn = require("../../db/index.js");
const User = require("../../db/models/user.model");

let user = {},
  token;

describe("Testing /users endpoints, with Auth Token", () => {
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
          user.id = doc._id;
          request(app)
            .post("/users/verify")
            .send({
              name: "Vinod",
              pass: "saifali",
            })
            .end((err, res) => {
              if (err) throw new Error(err);
              token = res.accessToken;
            });
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

  // Post with auth
  it("OK, User is created", (done) => {
    request(app)
      .post("/users/")
      .send({
        name: "gambino",
        pass: "heKnowSafe",
        category: "customer",
      })
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) throw new Error(err);
        const body = res.body;
        expect(body).to.contain.property("_id");
        expect(body).to.contain.property("name");
        expect(body).to.contain.property("pass");
        expect(body).to.contain.property("category");
      });
    done();
  });

  // Verify user with auth
  it("OK, Verify User", (done) => {
    request(app)
      .post("/users/verify")
      .send({
        name: "Vinod",
        pass: "saifali",
      })
      .end((err, res) => {
        if (err) throw new Error(err);
        assert.isDefined(res.accessToken);
      });
    done();
  });

  // get user
  it("OK, User's data can be fetched", (done) => {
    request(app)
      .get("/users/" + user.id)
      .set("Authorization", `Bearer ${token}`)
      .end((res) => {
        const body = res.body;
        expect(body).to.contain.property("_id");
      });
    done();
  });

  // patch user
  it("OK, User's name can be patched", (done) => {
    request(app)
      .patch("/users/" + user.id + "/Aman")
      .set("Authorization", `Bearer ${token}`)
      .end((res) => {
        const body = res.body;
        expect(body).to.contain.property("n");
        expect(body).to.contain.property("nModified");
        expect(body.n).to.equal(1);
        expect(body.nModified).to.equal(1);
      });
    done();
  });

  // delete user
  it("OK, User can be deleted", (done) => {
    request(app)
      .get("/users/" + user.id)
      .set("Authorization", `Bearer ${token}`)
      .end((res) => {
        const body = res.body;
        expect(body).to.contain.property("_id");
      });
    done();
  });
});
