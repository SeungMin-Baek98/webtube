import { see, edit, upload, deleteVideo } from "../controllers/videoController";

import express from "express";

const videoRouter = express.Router();

videoRouter.get("/upload", upload);
// id값으로 숫자만 받을수 있는 정규화식 => (\\d+)
videoRouter.get("/:id(\\d+)", see);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);

export default videoRouter;
