var token = require("../db/models/token.model"),
  User = require("../db/models/user.model");

const getScope = require("./scopes");

const model = {
  getUser: function (user, next) {
    // return fetched user from mongoDB,
    User.findById(user._id, function (err, doc) {
      if (err) return next(err);
      return next(doc);
    });
  },
  saveToken: function (token, user, next) {
    // save the recieved token in the db,
    const accessToken = token.accessToken;
    const accessTokenExpiresOn = token.expiresOn;
    const userId = user._id;
    const scope = getScope(user.category);

    const newToken = new token({
      accessToken,
      accessTokenExpiresOn,
      userId,
      scope,
    });

    newToken.save(function (err, doc) {
      if (err) throw err;
      return next(doc);
    });
  },
  verifyScope: function (accessToken, category, next) {
    // verify scopes for the given token,
    const scope = getScope(category);
    token.findOne({ accessToken: accessToken }, function (err, doc) {
      if (err) throw err;
      scope.forEach((e) => {
        if (!doc.scope.includes(e)) {
          return next(false);
        }
        return next(true);
      });
    });
    // get the token details from mongoDB,
    // check the scope for scopes in token,
    // return the desired boolean flag.
  },
};

module.exports = model;
