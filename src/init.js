// env파일에 선언된 변수를 express라이브러리가 읽어드릴수 있도록 도와주는 로직.
import "dotenv/config";

// 몽고db연결 페이지
import "./db";
import "./models/videoModel";
import "./models/userModel";
import app from "./server";

//서버 생성
const PORT = 4000;

const handleListening = () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);
