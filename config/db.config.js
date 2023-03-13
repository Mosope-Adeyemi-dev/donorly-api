const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const connectionString = process.env.MONGODB_CLOUD_URI;

const connectDb = async () => {
  if (connectionString == undefined) {
    throw new Error(
      "Connection string not found"
    );
  } else {
    await mongoose
      .connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("DB COnnected");
      })
      .catch((error) => {
        throw new Error(`Error connecting to database \n ${error}`);
      });
  }
};

module.exports = connectDb;
