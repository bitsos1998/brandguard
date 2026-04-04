// Admin authentication middleware — checks password on every /admin route
function adminAuth(req, res, next) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Check session cookie
  const sessionToken = req.cookies && req.cookies.admin_session;
  if (sessionToken === adminPassword) {
    return next();
  }

  // Check if this is a login POST
  if (req.method === 'POST' && req.path === '/login') {
    return next();
  }

  // Not authenticated — redirect to login
  res.redirect('/admin/login');
}

module.exports = adminAuth;
