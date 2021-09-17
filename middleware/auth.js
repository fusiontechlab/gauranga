function auth(req, res, next) {
  if(req.isAuthenticated()) {
      return next();
  }
  return res.redirect('/account_page');
}

module.exports = auth
