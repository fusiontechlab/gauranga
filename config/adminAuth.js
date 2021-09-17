module.exports = function auth(req, res, next) {
  if(req.isAuthenticated() && req.user.user_type =="admin") {
      return next();
  }
  return res.redirect('/admin');
}

