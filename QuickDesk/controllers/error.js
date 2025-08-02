exports.error=(req, res, next) => {
  res.status(404).render('404', {pageTitle: 'Page Not Found', isLoggedIn: false, user: req.session.user});
}