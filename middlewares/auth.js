import jwt from 'jsonwebtoken'
import { jwtSecret } from '../config/vars'

export default async (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token) {
    if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
      token = token.slice(7, token.length);
    }
    try {
      const decoded = await jwt.verify(token, jwtSecret)
      const current_time = parseInt(Date.now() / 1000);
      if (decoded.expirationDate < current_time) {
        return res.status(401).send({message: 'Seu token expirou'})
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.json({
        success: false,
        message: 'Token is not valid'
      });
    }
  } else {
    return res.status(401).send({message: 'User not allowed'})
  }
}
