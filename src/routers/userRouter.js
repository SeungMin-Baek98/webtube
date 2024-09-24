import {
  edit,
  remove,
  see,
  startGithubLogin,
  finishGithubLogin,
  logout,
} from "../controllers/userController";
import express from "express";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/delete", remove);

userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);

userRouter.get("/:id", see);

export default userRouter;
