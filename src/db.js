import mongoose from "mongoose";

console.log(process.env.DB_URL, process.env.COOKIE_SECRET);

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const handleOpen = () => {
  console.log("connected to DB");
};
const errorMessage = (error) => {
  console.log(error);
};

db.on("error", errorMessage);
db.once("open", handleOpen);
