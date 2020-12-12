var token = require("../db/models/token.model"),
  User = require("../db/models/user.model"),
  client = require("../db/models/client.model");

const getScope = require("./scopes");

module.exports.getClient = async function (clientId, clientSecret, next) {
  console.log("InGetClient...");

  var Client = await client.findById(clientId);

  if (Client.secret !== clientSecret) {
    console.log("Invalid Client");
  } else {
    console.log("GotClient");
    return Client;
  }
};

module.exports.getUser = function (name, pass, next) {
  console.log("In getUser...");
  User.findOne({ name: name }, function (err, user) {
    if (err) throw err;

    // test a matching password
    user.comparePassword(pass, function (err, isMatch) {
      if (err) throw err;
      console.log("gotUser ", isMatch);
      next(user);
    });
  });
};

module.exports.getUserFromClient = function (Client, next) {
  console.log("In getUserFromClient...");
  client
    .findOne({ _id: Client._id })
    .populate("user")
    .then(function (client) {
      if (!client) return false;
      if (!client.user) return false;
      console.log("gotUserFromClient");
      User.findById(client.user[0], (err, user) => next(err, user));
    })
    .catch(function (err) {
      console.log("getUserFromClient - Err: ", err);
    });
};

module.exports.saveToken = function (token, client, user, next) {
  console.log("In saveToken...");

  const newToken = new token(
    token.accessToken,
    token.accessTokenExpiresOn,
    client._id,
    user._id,
    token.scope
  );

  newToken.save(function (err, doc) {
    if (err) {
      console.log("saveToken - Err: ", err);
    }
    console.log("savedToken");
    next(doc);
  });
};

module.exports.validateScope = function (user, client, scope, next) {
  let scopeArray = scope.split(",");
  console.log("In validateScope...");
  let a = scopeArray,
    b = client.scope;

  if (a.length !== b.length) next(false);
  else {
    console.log("validatedScope");
    // comapring each element of array
    for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) next(false);
    next(true);
  }
  // next(isEqual(scopeArray, client.scope));
};

module.exports.verifyScope = function (accessToken, category, next) {
  // verify scopes for the given token,
  console.log("In verifyScope...");
  const scopes = getScope(category);
  token.findOne({ accessToken: accessToken }, function (err, doc) {
    if (err) {
      console.log("verifyScope - Err: ", err);
    }
    scopes.forEach((e) => {
      if (!doc.scope.includes(e)) {
        return next(false);
      }
      console.log("verifiedScope");
      return true;
    });
  });
};

//
