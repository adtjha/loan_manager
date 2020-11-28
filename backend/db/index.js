require("dotenv").config();
const mongoose = require("mongoose");

function connect() {
  return new Promise((resolve, reject) => {
    const uri = process.env.ATLAS_URI;
    if (process.env.NODE_ENV === "test") {
      const Mockgoose = require("mockgoose").Mockgoose;
      const mockgoose = new Mockgoose(mongoose);

      mockgoose.prepareStorage().then(() => {
        mongoose
          .connect(uri, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
          })
          .then((res, err) => {
            if (err) return reject(err);
            resolve();
          });
      });
    } else {
      mongoose
        .connect(uri, {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
        })
        .then(() => resolve())
        .catch((err) => reject(err));
    }
  });
}

function close() {
  return mongoose.disconnect();
}

module.exports = { connect, close };
//Connecting MongoDB database
