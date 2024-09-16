import userModel from "../models/userModel";
import bcyrpt from "bcrypt";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { email, username, nickname, password, rePassword, name, location } =
    req.body;
  const pageTitle = "Join";

  if (password !== rePassword) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "비밀번호가 일치하지 않습니다.",
    });
  }

  const existUsername = await userModel.exists(username);
  const existEmail = await userModel.exists(email);
  const existNickname = await userModel.exists(nickname);

  if (existUsername) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "귀하의 아이디가 사용중입니다.",
    });
  }
  if (existEmail) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "귀하의 이메일이 사용중입니다.",
    });
  }
  if (existNickname) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "귀하의 닉네임이 사용중입니다.",
    });
  }

  try {
    // userDB를 mongoDB 테이블에 넣는 로직.
    await userModel.create({
      email,
      username,
      name,
      nickname,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res
      .status(400)
      .render("join", { pageTitle, errorMessage: error._message });
  }
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const loginUser = await userModel.findOne({ username });

  if (!loginUser) {
    return res
      .status(400)
      .render("login", { pageTitle, errorMessage: "계정이 없습니다." });
  }
  const loginPass = await bcyrpt.compare(password, loginUser.password);
  if (!loginPass) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "패스워드가 일치하지않습니다.",
    });
  }
  res.end();
};

export const edit = (req, res) => res.send("Edit");
export const remove = (req, res) => res.send("DeleteUser");
export const logout = (req, res) => res.send("logout");
export const see = (req, res) => res.send("see");
