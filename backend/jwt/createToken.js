const jwt = require("jsonwebtoken");
const Client = require("../db/models/client.model");
const Token = require("../db/models/token.model");

module.exports = (options) => {
  return new Promise(async (resolve, reject) => {
    options = options || {};
    // Get accessToken
    const accessToken = options.accessToken;
    let newAccessToken;

    // Search for accessToken in token collection and retreive refreshToken,
    Token.findOne({ accessToken: accessToken })
      .then((token) => {
        const refreshToken = token.refreshToken;

        Client.findById(token.client)
          .then((client) => {
            const clientId = String(client._id);
            const secret = String(client.secret);

            jwt.verify(refreshToken, secret, (err, user) => {
              if (err) reject("JWT Verify Error : " + err);
              //Generate Access Token
              newAccessToken = jwt.sign(user.userShortId, clientId, {
                expiresIn: 15 * 60,
              });

              Token.updateOne(
                { accessToken: accessToken },
                { $set: { accessToken: newAccessToken } }
              )
                .then((res) => {
                  if (res.nModified === res.n) {
                    // if token DB is updated, then send new as response.
                    resolve({ accessToken: newAccessToken });
                  } else {
                    reject(res.nModified + " " + res.n);
                  }
                })
                .catch((err) => reject("TokenUpdateError : " + err));
            });
          })
          .catch((err) => reject("GetClientError : " + err));
      })
      .catch((err) => {
        reject("FindTokenError : " + err);
      });

    // Update Token DB, with new access token generated.
  });
  // generate accessToken using refreshToken
};
