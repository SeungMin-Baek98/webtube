import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },

  // socialLogin 이 false면 유저는 깃허브 로그인유저가 아니므로 아이디 비번으로 로그인을 할 수 있다,
  // socialLogin 이 true면 유저는 깃허브 로그인유저 이므로 깃허브 아이디로 로그인 할 수 있다.
  // 또한 socialLogin 이 true면 password가 공백으로 만들어지므로 비밀번호도 따로 필요없다.
  socialLogin: { type: Boolean, default: false },
  name: { type: String, required: true },

  password: { type: String },

  avatarUrl: String,
  location: String,
});

//User가 db에 저장되기 이전에 그정보를 가로채와서 password를 hash된 정보로 저장하는 로직.
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
