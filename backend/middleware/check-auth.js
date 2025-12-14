import jwt from 'jsonwebtoken';

const checkAuth = function(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'long_secret_string');
    next();
  } catch (error) {
    res.status(401).json({message: `Authentication failed`});
  }
}

export default checkAuth;
