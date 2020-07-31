import { Router } from 'express'
import auth from '../middlewares/auth'
import adminOnly from '../middlewares/adminOnly'
import Controller from '../middlewares/controllers'

export const router = Router()
export default router

// ## CLIENT ROUTES
router.get('/rents', auth, Controller('Rent-client-list'))
router.get('/rents/:rentId', auth, Controller('Rent-client-get'))
router.post('/rents/:rentId/return', auth, Controller('Rent-client-returnRent'))
router.post('/rents/movie/:movieId', auth, Controller('Rent-client-createRent'))

// ## ADMIN ROUTES
router.get('/admin/rents', auth, adminOnly, Controller('Rent-admin-list'))
router.get('/admin/rents/:rentId', auth, adminOnly, Controller('Rent-admin-get'))
router.delete('/admin/rents/:rentId', auth, adminOnly, Controller('Rent-admin-delete'))
router.post('/admin/rents/:rentId/return', auth, adminOnly, Controller('Rent-admin-returnRent'))
router.post('/admin/rents/movie/:movieId/user/:userId', auth, adminOnly, Controller('Rent-admin-createRent'))