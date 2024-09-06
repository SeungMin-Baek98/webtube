export const trending = (req, res) => {
  const videos = [
    { title: "Hello", rating: 5, comments: 2, views: 50, id: 1 },
    { title: "Hello2", rating: 9, comments: 12, views: 80, id: 2 },
    { title: "Hello3", rating: 2, comments: 1, views: 20, id: 3 },
  ];
  return res.render("home", { pageTitle: "Home", videos });
};
export const see = (req, res) => res.render("watch");
export const edit = (req, res) => res.render("edit");
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("UPload");
export const deleteVideo = (req, res) => res.send("DeleteVideo");
