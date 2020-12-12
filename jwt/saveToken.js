const token = require("../db/models/token.model");

module.exports = async function (options) {
  const accessToken = options.accessToken;
  const refreshToken = options.refreshToken;
  const user = options.user;
  const client = options.client;
  const scope = options.scope;

  // Save token to DB,
  /**
   * accessToken : accessToken,
   * accessTokenExpiresOn,
   * refreshToken: refreshToken,
   * refreshTokenExpiresOn,
   * user: user,
   * client: client,
   * scope: scope,
   */

  const newToken = new token({
    accessToken,
    refreshToken,
    user,
    client,
    scope,
  });

  await newToken
    .save()
    .then((doc) => {
      console.log("Token saved to DB: ", doc.accessToken);
    })
    .catch((err) => {
      console.log("Error while saving token: ", err);
    });
};
