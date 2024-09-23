// pug template 과 user data 공유
export const localsMiddelware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user
    ? req.session.user
    : req.session.name;
  res.locals.siteName = "Wetube";
  next();
};
