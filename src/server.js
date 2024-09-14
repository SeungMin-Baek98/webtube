import express from "express";
import morgan from "morgan";

import rootRouter from "../src/routers/rootRouter";
import userRouter from "../src/routers/userRouter";
import videoRouter from "../src/routers/videoRouter";

const app = express();
const logger = morgan("dev");

app.use(logger);
app.use(express.urlencoded({ extended: true }));

//퍼그 사용 설정
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

//router기본경로들
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
