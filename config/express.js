import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import Routes from '../routes'
import jwt from '../middlewares/jwt'
import bodyParser from 'body-parser'
import * as env from './vars'

export const buildApp = () => {
  const app = express()

  /**
   * Request logging
   * Defaults: development: console | production: file
   */
  app.use(morgan(env.logs))

  // Apply secure HTTP headers settings
  app.use(helmet())

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))
  
  // parse application/json
  app.use(bodyParser.json())

  app.use(cors())
  app.use(jwt)
  app.use(Routes)
  console.info(`📦 Loaded module: express`)
  return app
}
