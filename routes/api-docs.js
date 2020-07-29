import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'

export const router = Router()
export default router

const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger/index.yaml');

// auth routes
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));


