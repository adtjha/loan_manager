const OAuth2Server = require("oauth2-server");

const oauth = new OAuth2Server({
  model: require("./model"),
});

module.exports = oauth;
