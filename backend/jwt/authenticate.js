const client = require("../db/models/client.model");
const createToken = require("./createToken");
const Token = require("../db/models/token.model");
const jwt = require("jsonwebtoken");
const getCategoryByScope = require("../oauth2_/scopes").getCategoryByScope;

module.exports = (options) => {
  return function (req, res, next) {
    let accessToken = req.headers["authorization"];

    const category = getCategoryByScope(options.scope);

    if (!accessToken || accessToken === null) {
      res.status(403).json("Token is required");
    }
    accessToken = accessToken.split(" ")[1];

    Token.findOne({ accessToken: accessToken })
      .then((token) => {
        client.findOne({ _id: token.client }, (err, result) => {
          const clientId = String(result._id);

          jwt.verify(accessToken, clientId, (err, user) => {
            if (err) {
              if (err.name === "TokenExpiredError") {
                const newToken = createToken({ accessToken: accessToken });
                res.status(200).json({
                  token: newToken,
                  message:
                    "Your Access Token has expired, try with this fresh token.",
                });
              } else {
                res.status(403).json("Invalid Token" + err);
              }
            }
            req.user = user;
          });
          if (category.includes(result.category)) {
            next();
          } else {
            res.status(403).json({
              message: "Scope Not Valid",
              error: err,
              category: result.category,
              required: category,
            });
          }
        });
      })
      .catch((err) => {});
  };
};
