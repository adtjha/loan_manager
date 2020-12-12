var oauthServer = require("oauth2-server");
var Request = oauthServer.Request;
var Response = oauthServer.Response;

var oauth = require("./oauth"),
  client = require("../db/models/client.model");

module.exports = function (app) {
  app.post("/auth/token/", (req, res) => {
    var request = new Request(req);
    var response = new Response(res);

    console.log("In /auth/token functions");

    var token = oauth.token(request, response);

    token(request, response)
      .then(function (token) {
        // Todo: remove unnecessary values in response
        console.log("Token generated : ", token);
        return res.json(token);
      })
      .catch(function (err) {
        console.log("POST /auth/token " + err);
        return res.status(500).json(err);
      });
    // oauth
    //   .token(request, response)
    //   .then(function (token) {
    //     // Todo: remove unnecessary values in response
    //     console.log("Token generated : ", token);
    //     return res.json(token);
    //   })
    //   .catch(function (err) {
    //     console.log("POST /auth/token " + err);
    //     return res.status(500).json(err);
    //   });
  });

  app.post("/authorise", function (req, res) {
    var request = new Request(req);
    var response = new Response(res);

    console.log("In POST /authorise function");

    return oauth
      .authorize(request, response)
      .then(function (success) {
        //  if (req.body.allow !== 'true') return callback(null, false);
        //  return callback(null, true, req.user);

        res.json(success);
      })
      .catch(function (err) {
        console.log("POST /authorise Err");
        res.status(err.code || 500).json(err);
      });
  });

  app.get("/authorise", function (req, res) {
    console.log("In GET /authorise function");

    client
      .findOne({
        where: {
          _id: req.body.client_id,
        },
      })
      .then(function (model) {
        if (!model) return res.status(404).json({ error: "Invalid Client" });
        return res.json(model);
      })
      .catch(function (err) {
        console.log("GET /authorise Err");
        return res.status(err.code || 500).json(err);
      });
  });
};
