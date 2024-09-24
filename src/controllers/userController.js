import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

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

export const edit = (req, res) => res.send("Edit");
export const remove = (req, res) => res.send("DeleteUser");
export const see = (req, res) => res.send("see");
