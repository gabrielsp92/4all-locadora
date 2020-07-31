import { buildApp } from './config/express'

const app = buildApp()

/**
 * Exports express app
 * @public
 */
// export default app

module.exports = app