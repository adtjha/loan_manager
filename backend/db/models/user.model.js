const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    pass: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    secret: { type: String, required: true },
    category: { type: String, required: true },
    loans: [{ type: Schema.Types.ObjectId, ref: "loan" }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("pass")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.pass, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.pass = hash;
      next();
    });
  });
});

userSchema.statics.getUser = function (id) {
  return this.find({ _id: id }).exec();
};

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.pass, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
const User = mongoose.model("User", userSchema);

module.exports = User;
