const mongoose = require("mongoose");

const DB_HOST =
  "mongodb+srv://pdominiak:jPnzkmz3214!@cluster0.fq3ri.mongodb.net/db-contacts?retryWrites=true&w=majority";

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
    process.exit(1);
  });
