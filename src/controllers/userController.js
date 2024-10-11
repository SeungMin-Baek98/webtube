import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import videoModel from "../models/videoModel";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { email, username, password, rePassword, name, location } = req.body;

  const pageTitle = "Join";
  const existUsername = await userModel.exists({ username });
  const existEmail = await userModel.exists({ email });

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

  if (password !== rePassword) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "비밀번호가 일치하지 않습니다.",
    });
  }

  try {
    // userDB를 mongoDB 테이블에 넣는 로직.
    await userModel.create({
      email,
      username,
      name,
      location,
      password,
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
  const loginUser = await userModel.findOne({ username, socialLogin: false });

  if (!loginUser) {
    return res
      .status(400)
      .render("login", { pageTitle, errorMessage: "계정이 없습니다." });
  }

  const loginPass = await bcrypt.compare(password, loginUser.password);
  if (!loginPass) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "패스워드가 일치하지않습니다.",
    });
  }

  // 실질적으로 로그인을 하게 하는 코드
  req.session.loggedIn = true;
  req.session.user = loginUser;

  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";

  // 한번에 주소로 작성하게 된다면은 코드를 복붙하는 일이 발생할 경우 번거롭게 된다.
  // 객체로 구조분할 하여 다른데에서 import 하여 사용할 수 있도록
  // configuration 및 baseUrl 변수 선언
  const config = {
    client_id: process.env.GITHUB_CLIENT_ID,
    allow_signup: false,
    scope: "read:user user:email",
  };

  // 지금 이상태에서 변수를 import 하면은 브라우저는 해석을 못 할 것이다.
  // 인코딩을 하여서 URL로서 해석가능하게 해주는 번수.
  // URLSearchParams() 유틸리티 사용.
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";

    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    console.log(userData);

    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    console.log(emailData);

    // 깃허브 계정이 있을때 그 메일의 primary 및 verified 가 true 일 경우
    // 새로운 계정 생성.
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    // 없을경우 로그인 화면 그대로 출력
    if (!emailObj) {
      return res.redirect("/login");
    }

    // 깃허브의 계정이 있으면 그 계정을 토대로 로그인이 가능하다.
    let user = await userModel.findOne({ email: emailObj.email });
    if (!user) {
      // 깃허브 게정이 db에 없을경우
      // 버튼 클릭시 깃허브 계정으로 로그인 하는 코드
      user = await userModel.create({
        email: emailObj.email,
        username: userData.login,
        name: userData.name,
        avatarUrl: userData.avatar_url,
        password: "",
        location: userData.location,
        socialLogin: true,
      });
    }

    req.session.loggedIn = true;
    req.session.user = user;

    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const startKaKaoLogin = (req, res) => {
  return res.send("KaKao");
};
export const finishKaKaoLogin = (req, res) => {
  return res.send("KaKao");
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  // 로그인된 User의 id를 얻기위해서는
  // request object의 req.session.user에서
  // 찾을 수 있다.
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, username, email, location },
    file,
  } = req;

  const existUsername = await userModel.exists({ username, _id: { $ne: _id } });
  if (existUsername) {
    return res.status(400).render("edit", {
      pageTitle: "Edit Profile",
      errorMessage: "귀하의 이메일이 사용중입니다.",
    });
  }
  const existEmail = await userModel.exists({ email, _id: { $ne: _id } });
  if (existEmail) {
    return res.status(400).render("edit", {
      pageTitle: "Edit Profile",
      errorMessage: "귀하의 이메일이 사용중입니다.",
    });
  }

  const updateUser = await userModel.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      username,
      email,
      location,
    },
    { new: true }
  );
  req.session.user = updateUser;
  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  return res.render("users/change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id, password },
    },
    body: { oldPassword, newPassword, newPasswordRechecked },
  } = req;

  const matchPassword = await bcrypt.compare(oldPassword, password);
  if (!matchPassword) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "기존의 비밀번호가 틀립니다.",
    });
  }

  if (newPassword !== newPasswordRechecked) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "새로운 비밀번호가 다릅니다.",
    });
  }

  const user = await userModel.findById(_id);
  user.password = newPassword;
  await user.save();
  return res.redirect("/users/logout");
};

export const see = async (req, res) => {
  const { id } = req.params;
  const loginUser = await userModel.findById(id).populate("videos");
  if (!loginUser) {
    return res
      .status(404)
      .render("404", { pageTitle: "로그인된 유저가 없습니다!" });
  }
  return res.render("users/profile", {
    pageTitle: `${loginUser.name}님의 프로필`,
    loginUser,
  });
};
