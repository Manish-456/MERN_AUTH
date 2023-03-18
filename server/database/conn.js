const { MongoMemoryServer } = require("mongodb-memory-server");

const mongoose = require("mongoose");

async function connect(URI) {
  mongoose.set('strictQuery', true)
  const db = await mongoose.connect(URI);
  console.log("Database connected");
  return db;
}

module.exports = connect;
