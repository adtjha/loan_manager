const oauthServer = require("oauth2-server");
const Request = oauthServer.Request;
const Response = oauthServer.Response;
const oauth = require("./server");

module.exports = function tokenHandler(options) {
  return function (req, res, next) {
    let request = new Request(req);
    let response = new Response(res);
    return oauth
      .token(request, response, options)
      .then(function (code) {
        res.locals.oauth = { token: token };
        next();
      })
      .catch(function (err) {
        next(err);
        // handle error condition
      });
  };
};
