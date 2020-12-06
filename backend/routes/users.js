const router = require("express").Router();
const client = require("../db/models/client.model");
let User = require("../db/models/user.model");

const Crypto = require("crypto");

const authenticate = require("../oauth/authenticate");

// Get all the Users that are stored.
router.get(
  "/",
  authenticate({ scope: "create/update/delete costmer profile" }),
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
  // authenticate({ scope: "create/update/delete costmer profile" }),
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

router.route("/getUserFromClient").post(function (req, res) {
  const clientId = req.body.clientId;
  client
    .findOne({ _id: clientId })
    .populate("user")
    .then(function (client) {
      console.log(client);
      if (!client) return false;
      if (!client.user) return false;
      console.log("gotUserFromClient : " + client.user);
      res.json(client);
    })
    .catch(function (err) {
      console.log("getUserFromClient - Err: ", err);
    });
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
        client.findOne({ user: { $in: user._id } }, function (err, client) {
          if (err) throw err;
          res
            .status(200)
            .json({ clientID: client._id, clientSecret: client.secret });
        });
      });
    });
  });
});

// Updating a specific user's name.
router.route("/:id/:name").patch((req, res) => {
  // update specific user details.
  const id = req.params.id;

  const name = req.params.name;

  User.updateOne({ _id: id }, { name: name }, (err, callback) => {
    if (err) throw err;
    res.json(callback);
  });
});

// Get a specific user details.
router.route("/:id").get((req, res) => {
  //  return specific user details.
  const id = req.params.id;

  User.findOne({ _id: id }, (err, user) => {
    if (err) throw err;
    res.status(200).json(user);
  });
});

// Delete the user specified from the database.
router.route("/:id").delete((req, res) => {
  const id = req.params.id;

  User.deleteOne({ _id: id }, (err, result) => {
    if (err) throw err;
    res.status(200).json(result);
  });
});

module.exports = router;
