import express from "express";
import morgan from "morgan";
import globalRouter from "../src/routers/globalRouter";
import userRouter from "../src/routers/userRouter";
import videoRouter from "../src/routers/videoRouter";

//서버 생성
const PORT = 4000;

const app = express();
const logger = morgan("dev");
app.use(logger);

//router기본경로들
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

const handleListening = () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);
