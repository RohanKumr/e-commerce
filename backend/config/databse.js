const mongoose = require("mongoose");

const connectDb = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    })
    .then((data) => {
      console.log("connected db ", data.connection.host);
    });
};

module.exports = connectDb;
