import { Router } from 'express'
import auth from '../middlewares/auth'
import Controller from '../middlewares/controllers'

export const router = Router()
export default router

// auth routes
router.post('/auth/register', Controller('Auth-mixed-register'))
router.post('/auth/login', Controller('Auth-mixed-login'))
router.get('/auth/me', auth, Controller('Auth-mixed-me'))
router.post('/auth/logout', auth, Controller('Auth-mixed-logout'))
router.get('/auth/refresh', auth, Controller('Auth-mixed-refresh'))
