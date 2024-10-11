import userModel from "../models/userModel";
import videoModel from "../models/videoModel";

export const home = async (req, res) => {
  const videos = await videoModel.find({});
  console.log(videos);
  return res.status(404).render("Home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  //mongoose의 내장함수인 populate()를 통하여
  //videoModel 에서 User테이블을 참조하는 owner의 로그인된 유저의 정보를
  //받아올 수 있다.
  //직접 변수를 ex) const videoOwner = await userModel.findById(video.owner)를 하지않아도 된다.
  const video = await videoModel.findById(id).populate("owner");
  console.log(video);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "VIDEO NOT FOUND!!😅" });
  }
  return res.render("watch", { pageTitle: `Watching`, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  // 여기서는 edit 템플릿에 video객체를 보내야하는게 더 적절하므로 findById()를 사용하는게 적절하다.
  const video = await videoModel.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "VIDEO NOT FOUND!!😅" });
  }

  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }

  return res.render("edit", {
    pageTitle: `Editing: ${video.title} `,
    video,
  });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const video = await videoModel.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "VIDEO NOT FOUND!!😅" });
  }

  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }

  await videoModel.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: videoModel.formatHashtags(hashtags),
  });

  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const file = req.file;
  const { title, description, hashtags } = req.body;

  // video생성에 문제가 없다면 / <- Home 페이지로 리다이렉트 될 것 이다.
  try {
    const newVideo = await videoModel.create({
      fileUrl: file.path,
      title,
      owner: _id,
      description,
      hashtags: videoModel.formatHashtags(hashtags),
    });
    const user = await userModel.findById(_id);
    user.videos.unshift(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    // 오류가 있다면 upload 페이지에 남아 있을 것 이다.
    console.log("error", error);
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  // 게시글 삭제 로직
  const {
    user: { _id },
  } = req.session;
  const video = await videoModel.findById(id);
  const loginUser = await userModel.findById(_id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "VIdeo not found." });
  }

  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }

  await videoModel.findByIdAndDelete(id);
  loginUser.videos.splice(loginUser.videos.indexOf(id), 1);
  loginUser.save();
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];

  if (keyword) {
    videos = await videoModel.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};
