import { Router } from 'express'
import auth from '../middlewares/auth'
import adminOnly from '../middlewares/adminOnly'
import Controller from '../middlewares/controllers'

export const router = Router()
export default router

// ## CLIENT ROUTES
router.patch('/users', auth, Controller('User-client-patch'))

// ## ADMIN ROUTES
router.get('/admin/users', auth, adminOnly, Controller('User-admin-list'))
router.post('/admin/users', auth, adminOnly, Controller('User-admin-create'))
router.get('/admin/users/:userId', auth, adminOnly, Controller('User-admin-get'))
router.patch('/admin/users/:userId', auth, adminOnly, Controller('User-admin-patch'))
router.delete('/admin/users/:userId', auth, adminOnly, Controller('User-admin-delete'))
router.put('/admin/users/:userId/promote', auth, adminOnly, Controller('User-admin-promote'))
router.put('/admin/users/:userId/demote', auth, adminOnly, Controller('User-admin-demote'))