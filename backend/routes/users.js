const router = require("express").Router();
let User = require("../models/user.model");

router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const pass = String(req.body.pass);
  const category = req.body.category;

  const newUser = new User({ name, pass, category });

  newUser
    .save()
    .then(() => res.json("User added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/auth").post((req, res) => {
  const name = req.body.name;
  const pass = String(req.body.pass);

  User.findOne({ name: name }, function (err, user) {
    if (err) throw err;

    // test a matching password
    user.comparePassword(pass, function (err) {
      if (err) throw err;
      res.json("Valid User");
    });
  });
  //   on success, send signal,
});

router.route("/:id/name").patch((req, res) => {
  // update specific user details.
  const id = req.params.id;

  const name = req.body.name;

  User.updateOne({ _id: id }, { name: name }, (err, callback) => {
    if (err) throw err;
    res.json(callback);
  });
});

router.route("/:id").get((req, res) => {
  //  return specific user details.
  const id = req.params.id;

  User.findOne({ _id: id }, (err, user) => {
    if (err) throw err;
    res.status(200).json(user);
  });
});

module.exports = router;
