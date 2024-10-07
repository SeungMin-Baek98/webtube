import {
  getEdit,
  postEdit,
  see,
  startGithubLogin,
  finishGithubLogin,
  startKaKaoLogin,
  finishKaKaoLogin,
  logout,
} from "../controllers/userController";
import express from "express";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);

//깃허브 로그인 라우터
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);

//카카오 로그인 라우터
userRouter.get("/kakao/start", publicOnlyMiddleware, startKaKaoLogin);
userRouter.get("/kakao/finish", publicOnlyMiddleware, finishKaKaoLogin);

// userRouter.get("/:id", see);

userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);

export default userRouter;
