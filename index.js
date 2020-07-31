import { port, env } from './config/vars'
import app from './app'

// Listen to requests
app.listen(port, () => console.info(`🏁 Server started on port ${port} (${env})`))
/**
 * Exports express app
 * @public
 */
// export default app

module.exports = app