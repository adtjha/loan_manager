const jwt = require("jsonwebtoken");
const getScope = require("../oauth2_/scopes").getScope;
const saveToken = require("./saveToken");
const checkUserForToken = require("./checkUserForToken");

module.exports = async (options) => {
  const clientId = options.clientId,
    clientSecret = options.clientSecret,
    user = options.user;

  const userShortId = {
    id: user._id,
    secret: user.secret,
  };

  // Check if token is already stored in database.
  var checkResult = checkUserForToken({ user: user._id, clientId });

  return new Promise((resolve, reject) => {
    checkResult
      .then((token) => {
        console.log(token);
        if (token !== null && token.accessToken !== null) {
          resolve({
            accessToken: token.accessToken,
            message: "Token already present.",
          });
        } else {
          const accessToken = jwt.sign({ userShortId }, clientId, {
            expiresIn: 15 * 60,
          });
          const refreshToken = jwt.sign({ userShortId }, clientSecret, {
            expiresIn: "7d",
          });

          saveToken({
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: user._id,
            client: clientId,
            scope: getScope(user.category),
          })
            .then(() => {
              resolve({ accessToken: accessToken });
            })
            .catch((err) => reject(err));
        }
      })
      .catch((err) => reject(err));
  });
};
