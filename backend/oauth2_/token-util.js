var crypto = require("crypto");
var randomBytes = require("crypto").randomBytes;

module.exports = {
  generateRandomToken: function () {
    var buffer = randomBytes(256);
    return crypto.createHash("sha1").update(buffer).digest("hex");
  },

  generateAccessTokenExpiresOn: function () {
    return new Date(Date.now() + 3600 * 1000);
  },
};
