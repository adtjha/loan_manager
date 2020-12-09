const router = require("express").Router();
const client = require("../db/models/client.model");
const Token = require("../db/models/token.model");
let User = require("../db/models/user.model");

const Crypto = require("crypto");
const authenticate = require("../jwt/authenticate"),
  token = require("../jwt/token"),
  createToken = require("../jwt/createToken");

// Get all the Users that are stored.
router.get(
  "/",
  authenticate({ scope: "read all customer profile" }),
  (req, res) => {
    User.find()
      .populate("loans")
      .then((users) => res.json(users))
      .catch((err) => res.status(400).json("Error: " + err));
  }
);

// Add a new user to the database.
router.post(
  "/",
  authenticate({ scope: "create/update/delete costmer profile" }),
  (req, res) => {
    const name = req.body.name;
    const pass = String(req.body.pass);
    const category = req.body.category;

    const secret = Crypto.randomBytes(21).toString("base64").slice(0, 21);

    const newUser = new User({ name, pass, secret, category });

    newUser
      .save()
      .then((doc) => {
        client.findOneAndUpdate(
          { category: category },
          { $push: { user: doc._id } },
          function (err, updated) {
            if (err) res.status(400).json("Error: " + err);
            res.json(doc);
          }
        );
      })
      .catch((err) => res.status(400).json("Error: " + err));
  }
);

router.route("/logout").delete(function (req, res) {
  var token = req.headers["authorization"];
  var accessToken = token.split(" ")[1];

  Token.deleteOne({ accessToken: accessToken })
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.route("/refreshToken").post(function (req, res) {
  var token = req.headers["authorization"];
  var accessToken = token.split(" ")[1];
  let newToken = createToken({ accessToken });
  newToken
    .then((token) => {
      res.status(200).json(token);
    })
    .catch((err) => res.status(500).json("Error: " + err));
});

router.route("/verify").post(function (req, res) {
  const name = req.body.name;
  const pass = String(req.body.pass);

  User.findOne({ name: name }, function (err, user) {
    if (err) throw err;

    // test a matching password
    user.comparePassword(pass, function (err, isMatch) {
      if (err) throw err;
      User.findOne({ name: name }, function (err, user) {
        if (err) throw err;
        client.findOne(
          { user: { $in: user._id } },
          async function (err, client) {
            if (err) throw err;
            // res
            //   .status(200)
            //   .json({ clientID: client._id, clientSecret: client.secret });
            const clientId = String(client._id);
            const clientSecret = String(client.secret);
            token({ clientId, clientSecret, user })
              .then((token) => {
                console.log(token);
                res.status(200).json(token);
              })
              .catch((err) => console.log(err));
          }
        );
      });
    });
  });
});

// Updating a specific user's name.
router.patch(
  "/:id/:name",
  authenticate({ scope: "create/update/delete costmer profile" }),
  (req, res) => {
    // update specific user details.
    const id = req.params.id;
    const name = req.params.name;

    User.updateOne({ _id: id }, { name: name }, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  }
);

// Get a specific user details.
router.get(
  "/:id",
  authenticate({ scope: "read single customer profile" }),
  (req, res) => {
    //  return specific user details.
    const id = req.params.id;

    User.findOne({ _id: id }, (err, user) => {
      if (err) throw err;
      res.status(200).json(user);
    });
  }
);

// Delete the user specified from the database.
router.delete(
  "/:id",
  authenticate({ scope: "create/update/delete costmer profile" }),
  (req, res) => {
    const id = req.params.id;

    User.deleteOne({ _id: id }, (err, result) => {
      if (err) throw err;
      res.status(200).json(result);
    });
  }
);

module.exports = router;
