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
  return res.render("watch", { pageTitle: `Watching`, video });
};

export const getEdit = (req, res) => {
  const { id } = req.params;

  return res.render("edit", {
    pageTitle: `Editing: `,
  });
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

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
      createdAt: Date.now(),
      hashtags: hashtags.split(",").map((word) => `#${word}`),
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
