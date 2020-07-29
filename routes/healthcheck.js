import { Router } from 'express'

export const router = Router()
export default router

router.get('/healthcheck', (req, res) => res.send('OK'))
