import multer from "multer";

// pug template 과 user data 공유
export const localsMiddelware = (req, res, next) => {
  //loggedIn은 유저가 로그인 할 때 session에 저장되는 정보이다. (Boolean 타입으로서 true / false)
  //로 유저의 로그인 유무를 파악 할 수 있다.
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  //local 덕분에 우리는 현재 로그인한 유저의 정보를
  //다른 template에서 변수로서 사용할 수 있다.
  //loggedInUser를 사용함으로서.
  res.locals.loggedInUser = req.session.user || {};
  res.locals.siteName = "Wetube";
  next();
};

//유저가 로그인 되있으면 요청을 계속 하고
//로그인 되어 있지않으면 login페이지로 redirect해주는 로직이다.
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

//유저가 로그인 되어 있지않으면 요청을 계속 하고
//로그인 되어 있으면 홈페이지로 redirect로 해주는 로직이다.
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};

// 소셜 로그인 세션 처리 미들웨어
export const clearSessionForNewSocialLogin = (req, res, next) => {
  // 기존 로그인된 소셜 로그인 계정이 있는 경우 세션 제거
  if (req.session.loggedIn) {
    req.session.destroy((err) => {
      if (err) {
        console.error("세션 삭제 실패:", err);
        return res.redirect("/login");
      }
      // 세션 삭제 후 새로운 소셜 로그인 시도
      req.session = {}; // 명시적으로 세션을 초기화
      next(); // 세션이 제거되었으므로 다음 미들웨어로 이동
    });
  } else {
    next(); // 세션이 없으면 다음 미들웨어로 이동
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatar",
  limits: {
    fileSize: 3000000,
  },
});
export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000,
  },
});
