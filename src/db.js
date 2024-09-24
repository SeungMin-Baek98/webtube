import mongoose from "mongoose";

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
