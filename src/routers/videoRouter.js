import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
} from "../controllers/videoController";

import express from "express";

const videoRouter = express.Router();

// id값으로 숫자만 받을수 있는 정규화식 => (\\d+)
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;
