import { port, env } from './config/vars'
import { buildApp } from './config/express'

const app = buildApp()
// Listen to requests
app.listen(port, () => console.info(`🏁 Server started on port ${port} (${env})`))
/**
 * Exports express app
 * @public
 */
// export default app

module.exports = app