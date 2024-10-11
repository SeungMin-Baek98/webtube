import mongoose from "mongoose";

//create mongoose schema using validation
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: 20,
  },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
  },
  fileUrl: { type: String, required: true },
  // User 테이블을 직접 참조할 수 있게끔 하기위하여
  // mongoose에서 제공하는 내장함수인 populate()를 통하여
  // 코드의 간소화를 할 수 있다.
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

// middleware static logic by using modelSchema
videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const videoModel = mongoose.model("Video", videoSchema);

export default videoModel;
