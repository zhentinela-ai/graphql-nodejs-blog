const mongoose = require("mongoose");

const connectDB = async () => {
  const connect = await mongoose.connect("mongodb://localhost/blogdb");
  console.log("MongoDB Connected to Database:", connect.connection.db.databaseName);
};

module.exports = { connectDB };
