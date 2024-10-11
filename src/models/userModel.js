import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },

  socialLogin: { type: Boolean, default: false },
  name: { type: String, required: true },

  password: { type: String },

  avatarUrl: String,
  location: String,
  //user당 여러개의 videos를 생성할 수 있으므로 videos는 배열로서 만들어져야된다.
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

//User가 db에 저장되기 이전에 그정보를 가로채와서 password를 hash된 정보로 저장하는 로직.
userSchema.pre("save", async function () {
  //new video를만들때도 save()로직을 통하여 비밀번호 hash로직이 실행이될것이다.
  //그러면 기존의 비밀번호로는 로그인이 안되는 버그가 발생할것이다.
  //여기서의 this는 user와 같으므로
  //isModified()로직을 통하여
  // 비밀번호만 수정하였을떄 비밀번호가 hashing되게끔 할 수 있다.
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
