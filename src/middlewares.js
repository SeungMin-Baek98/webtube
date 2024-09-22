// pug template 과 user data 공유
export const localsMiddelware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedUserNickname = req.session.user;
  next();
};
