import {
  getEdit,
  postEdit,
  see,
  startGithubLogin,
  finishGithubLogin,
  startKaKaoLogin,
  finishKaKaoLogin,
  logout,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";

import { avatarUpload, protectorMiddleware } from "../middlewares";

import express from "express";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);

//깃허브 로그인 라우터
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);

//카카오 로그인 라우터
userRouter.get("/kakao/start", startKaKaoLogin);
userRouter.get("/kakao/finish", finishKaKaoLogin);

//유저 프로필 편집 라우터
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);

userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);

userRouter.get("/:id", see);

export default userRouter;
