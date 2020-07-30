import { Router } from 'express'
import auth from '../middlewares/auth'
import adminOnly from '../middlewares/adminOnly'
import Controller from '../middlewares/controllers'

export const router = Router()
export default router

// ## CLIENT ROUTES
router.get('/movie', auth, Controller('Movie-client-list'))
router.get('/movie/:movieId', auth, Controller('Movie-client-get'))

// ## ADMIN ROUTES
router.post('/admin/movie', auth, adminOnly, Controller('Movie-admin-create'))
router.patch('/admin/movie/:movieId', auth, adminOnly, Controller('Movie-admin-patch'))
router.delete('/admin/movie/:movieId', auth, adminOnly, Controller('Movie-admin-delete'))