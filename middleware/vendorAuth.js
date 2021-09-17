function auth(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/vendor');
  }
  
  module.exports = auth
  