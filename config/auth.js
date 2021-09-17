module.exports = function auth(req, res, next) {
  if(req.isAuthenticated() && req.user.user_type =="user") {
      return next();
  }
  return res.redirect('/account_page');
}




