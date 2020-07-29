import jwt from 'express-jwt'
import { jwtSecret } from '../config/vars'

export default jwt({
  secret: jwtSecret,
  credentialsRequired: false,
  algorithms: ['HS256'],
})
