// 몽고db연결 페이지
import "./db";
import "./models/videoModel";
import app from "./server";

//서버 생성
const PORT = 4000;

const handleListening = () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);
