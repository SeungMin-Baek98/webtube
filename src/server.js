import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";

import rootRouter from "../src/routers/rootRouter";
import userRouter from "../src/routers/userRouter";
import videoRouter from "../src/routers/videoRouter";

import { localsMiddelware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.use(logger);
app.use(express.urlencoded({ extended: true }));

// User Cookie 설정
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    // saveUninitialized 를 true -> false로 변경해줌으로서
    // 비로그인한 유저의 정보도 브라우저의 쿠키에 저장되던 부분을
    // 유저가 로그인했을때만 쿠키에 저장되게 변경.
    saveUninitialized: false,
    // connect-mongo 라이브러리를 통하여
    // db에 저장된 유저 정보의 쿠키를 세션에다가 저장하여
    // 기존의 새로고침을 하여도 유저의 정보가 세션에 계속
    // 존재하게하는 로직.
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

//퍼그 사용 설정
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

//router기본경로들
app.use(localsMiddelware);
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
