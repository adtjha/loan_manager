const ObjectId = require("mongoose").Types.ObjectId;
const Token = require("../db/models/token.model");

module.exports = async (options) => {
  const user = new ObjectId(options.user);
  const clientId = options.clientId;
  console.log(user, clientId);

  return await Token.findOne({ user: String(options.user) })
    .select("accessToken")
    .exec();
};
