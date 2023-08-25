const mongoose = require("mongoose");
const config = require("config");

const connectDB = async () => {
  try {
    await mongoose.connect(config.get("mongoURI"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "propertyfy",
    });

  } catch (error) {
    console.error('MongoDB connection failed', error);
    process.exit(1);
  }
};

module.exports = connectDB;
