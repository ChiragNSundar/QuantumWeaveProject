const app = require('../server/index');

module.exports = (req, res) => {
  // Ensure req.url retains the /api prefix expected by Express routes
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url}`;
  }
  return app(req, res);
};
