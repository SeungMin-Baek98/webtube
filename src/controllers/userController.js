import videoModel from "../models/videoModel";

export const join = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const edit = (req, res) => res.send("Edit");
export const remove = (req, res) => res.send("DeleteUser");
export const login = (req, res) => res.send("Login");
export const logout = (req, res) => res.send("logout");
export const see = (req, res) => res.send("see");
