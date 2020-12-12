const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Crypto = require("crypto");

const clientSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    grants: { type: Array, required: true },
    secret: { type: String, required: true },
    scope: { type: Array, required: true },
    user: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const client = mongoose.model("client", clientSchema);

client.findOne({ category: "customer" }, function (err, result) {
  if (err) throw err;
  if (result === null) {
    const customerClient = new client({
      category: "customer",
      grants: ["client_credentials"],
      scope: ["read single customer profile", "read single loan profile"],
      secret: Crypto.randomBytes(21).toString("base64").slice(0, 21),
    });
    customerClient
      .save()
      .then((doc) => console.log(doc.category))
      .catch((err) => console.error(err));
  }
});

client.findOne({ category: "agent" }, function (err, result) {
  if (err) throw err;
  if (result === null) {
    const agentClient = new client({
      category: "agent",
      grants: ["client_credentials"],
      scope: [
        "create/update/delete costmer profile",
        "read all customer profile",
        "create/update/delete loan profile",
        "read single loan profile",
        "read all loan profiles",
      ],
      secret: Crypto.randomBytes(21).toString("base64").slice(0, 21),
    });
    agentClient
      .save()
      .then((doc) => console.log(doc.category))
      .catch((err) => console.error(err));
  }
});

client.findOne({ category: "admin" }, function (err, result) {
  if (err) throw err;
  if (result === null) {
    const adminClient = new client({
      category: "admin",
      grants: ["client_credentials"],
      scope: [
        "create/update/delete costmer profile",
        "read all customer profile",
        "create/update/delete loan profile",
        "read single loan profile",
        "read all loan profiles",
        "approve loan profile",
        "rollback loan profile",
      ],
      secret: Crypto.randomBytes(21).toString("base64").slice(0, 21),
    });
    adminClient
      .save()
      .then((doc) => console.log(doc.category))
      .catch((err) => console.error(err));
  }
});

module.exports = client;
