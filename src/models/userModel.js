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
});

//User가 db에 저장되기 이전에 그정보를 가로채와서 password를 hash된 정보로 저장하는 로직.
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
