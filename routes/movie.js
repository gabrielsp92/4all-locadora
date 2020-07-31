import { Router } from 'express'
import auth from '../middlewares/auth'
import adminOnly from '../middlewares/adminOnly'
import Controller from '../middlewares/controllers'

export const router = Router()
export default router

// ## CLIENT ROUTES
router.get('/movies', auth, Controller('Movie-client-list'))
router.get('/movies/:movieId', auth, Controller('Movie-client-get'))

// ## ADMIN ROUTES
router.post('/admin/movies', auth, adminOnly, Controller('Movie-admin-create'))
router.patch('/admin/movies/:movieId', auth, adminOnly, Controller('Movie-admin-patch'))
router.delete('/admin/movies/:movieId', auth, adminOnly, Controller('Movie-admin-delete'))