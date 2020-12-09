const mongoose = require("mongoose");
let User = require("./user.model"),
  client = require("./client.model");

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: User },
  client: { type: Schema.Types.ObjectId, required: true, ref: client },
  scope: { type: Array, required: true },
});

const token = mongoose.model("token", tokenSchema);

module.exports = token;
