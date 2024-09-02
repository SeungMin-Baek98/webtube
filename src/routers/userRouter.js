import express from "express";

const userRouter = express.Router();
const handleUserEdit = (req, res) => res.send("This is UserEdit page!!");
userRouter.get("/edit", handleUserEdit);

export default userRouter;
