import fs from 'fs'
import { Router } from 'express'

export const router = Router()
export default router



const routesDir = './routes/'
const loadRoute = (file) => {
  if (file === 'index.js') return
  const routeName = file.split('.')[0]
  console.info(`✈️ Loaded route: ${routeName}`)
  router.use(require(`./${file}`).default)
}

fs.readdir(routesDir, (err, files) => !err && files.forEach(loadRoute))
