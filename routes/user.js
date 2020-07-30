import { Router } from 'express'
import auth from '../middlewares/auth'
import adminOnly from '../middlewares/adminOnly'
import Controller from '../middlewares/controllers'

export const router = Router()
export default router

// ## CLIENT ROUTES
router.patch('/user', auth, Controller('User-client-patch'))

// ## ADMIN ROUTES
router.get('/admin/user', auth, adminOnly, Controller('User-admin-list'))
router.post('/admin/user', auth, adminOnly, Controller('User-admin-create'))
router.get('/admin/user/:userId', auth, adminOnly, Controller('User-admin-get'))
router.patch('/admin/user/:userId', auth, adminOnly, Controller('User-admin-patch'))
router.delete('/admin/user/:userId', auth, adminOnly, Controller('User-admin-delete'))
router.put('/admin/user/:userId/promote', auth, adminOnly, Controller('User-admin-promote'))
router.put('/admin/user/:userId/demote', auth, adminOnly, Controller('User-admin-demote'))