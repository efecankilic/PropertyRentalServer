const jwt = require('jsonwebtoken');
const config = require('config');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.header('x-auth-token');
  console.log('Token Missing :|')
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    console.log('Token Valid :)')
    next();
  } catch (error) {
    console.log('Token Invalid :(')
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
