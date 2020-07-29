import dotenv from 'dotenv'

dotenv.config()

export const env = process.env.NODE_ENV || 'development'
export const isTest = env === 'test'
export const isDev = env === 'development'
export const isProd = env === 'production'

export const port = process.env.PORT || 4000
export const jwtSecret = process.env.JWT_SECRET || 'B0rk B4rk'
export const jwtExpirationInterval = process.env.JWT_EXPIRATION_MINUTES

export const logs = isProd ? 'combined' : 'dev'

if (isDev) {
  console.log(
    'Environment: ',
    require('util').inspect(module.exports, { colors: true }),
  )
}