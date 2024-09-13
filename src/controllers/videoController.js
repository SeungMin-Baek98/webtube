import videoModel from "../models/videoModel";

export const home = async (req, res) => {
  const videos = await videoModel.find({});
  console.log(videos);
  return res.render("Home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.findById(id);
  console.log(video);
  if (video === null) {
    return res.render("404", { pageTitle: "VIDEO NOT FOUND!!😅" });
  }
  return res.render("watch", { pageTitle: `Watching`, video });
};

export const getEdit = async (req, res) => {
  let { id } = req.params;
  // 여기서는 edit 템플릿에 video객체를 보내야하는게 더 적절하므로 findById()를 사용하는게 적절하다.
  const video = await videoModel.findById(id);

  if (video === null) {
    return res.render("404", { pageTitle: "VIDEO NOT FOUND!!😅" });
  }

  return res.render("edit", {
    pageTitle: `Editing: ${video.title} `,
    video,
  });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await videoModel.exists({ _id: id });

  if (video === null) {
    return res.render("404", { pageTitle: "VIDEO NOT FOUND!!😅" });
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
  const { title, description, hashtags } = req.body;

  // video생성에 문제가 없다면 / <- Home 페이지로 리다이렉트 될 것 이다.
  try {
    await videoModel.create({
      title,
      description,
      hashtags: videoModel.formatHashtags(hashtags),
    });

    return res.redirect("/");
  } catch (error) {
    // 오류가 있다면 upload 페이지에 남아 있을 것 이다.
    console.log("error", error);
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  // 게시글 삭제 로직
  await videoModel.findByIdAndDelete(id);
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
