const mongoose = require("mongoose");
require("dotenv").config();

console.log("Testing MongoDB connection...");
console.log("Connection URI:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err.message);
    console.log("Error Code:", err.code);
    process.exit(1);
  });
