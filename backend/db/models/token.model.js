// var mongoose = require("mongoose"),
//   modelName = "token",
//   schemaDefinition = require("../schema/" + modelName),
//   schemaInstance = mongoose.Schema(schemaDefinition);

// schemaInstance.index({ refreshTokenExpiresAt: 1 }, { expireAfterSeconds: 0 });

// var modelInstance = mongoose.model(modelName, schemaInstance);

// module.exports = modelInstance;

const mongoose = require("mongoose");
let User = require("./user.model");

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  accessToken: { type: String, required: true },
  accessTokenExpiresOn: { type: Date, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: User },
  scope: { type: Array, required: true },
});

const token = mongoose.model("token", tokenSchema);

module.exports = token;
