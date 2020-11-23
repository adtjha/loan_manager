var clientModel = require("./mongo/model/client"),
  tokenModel = require("./mongo/model/token"),
  userModel = require("../../model/user");

const model = {
  getAccessToken: function (token, callback) {
    tokenModel
      .findOne({
        accessToken: token,
      })
      .lean()
      .exec(
        function (callback, err, token) {
          if (!token) {
            console.error("Token not found");
          }

          callback(err, token);
        }.bind(null, callback)
      );
  },
};

module.exports = model;
