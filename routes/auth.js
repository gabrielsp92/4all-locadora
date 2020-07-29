import { Router } from 'express'
import jwt from '../middlewares/jwt'
import Controller from '../middlewares/controllers'

export const router = Router()
export default router

// auth routes
router.post('/auth/login', Controller('Auth-mixed-login'))
router.get('/auth/me', jwt, Controller('Auth-mixed-me'))
router.post('/auth/logout', jwt, Controller('Auth-mixed-logout'))
router.get('/auth/refresh', jwt, Controller('Auth-mixed-refresh'))
