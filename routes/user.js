import { Router } from 'express'
import auth from '../middlewares/auth'
import Controller from '../middlewares/controllers'

export const router = Router()
export default router

// auth routes
router.patch('/user', auth, Controller('User-client-patch'))

// admin routes
router.get('/admin/user', Controller('User-admin-list'))
router.post('/admin/user', Controller('User-admin-create'))
router.get('/admin/user/:userId', Controller('User-admin-get'))
router.patch('/admin/user/:userId', Controller('User-admin-patch'))
router.delete('/admin/user/:userId', Controller('User-admin-delete'))