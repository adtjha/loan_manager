const router = require("express").Router();
let User = require("../db/models/user.model");

// Get all the Users that are stored.
router.route("/").get((req, res) => {
  User.find()
    .populate("loans")
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Add a new user to the database.
router.route("/").post((req, res) => {
  const name = req.body.name;
  const pass = String(req.body.pass);
  const category = req.body.category;

  const newUser = new User({ name, pass, category });

  newUser
    .save()
    .then((doc) => res.json(doc))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/auth").post((req, res) => {
  const name = req.body.name;
  const pass = String(req.body.pass);

  User.findOne({ name: name }, function (err, user) {
    if (err) throw err;

    // test a matching password
    user.comparePassword(pass, function (err, isMatch) {
      if (err) throw err;
      res.json(isMatch);
    });
  });
  //   on success, send signal,
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
