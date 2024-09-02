import express from "express";

const videoRouter = express.Router();
const handleWatchVideo = (req, res) => res.send("this is Watch Video page!!");
videoRouter.get("/watch", handleWatchVideo);

export default videoRouter;
