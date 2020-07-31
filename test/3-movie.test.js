
import { expect } from 'chai'
import request  from 'supertest'
import server from '../app'
import models from '../models'

let userId = null
let userToken = ''
let adminId = null
let adminToken = null
let shouldDeleteRole = false
let movieId = null
let secondMovieId = null
let thirdMovieId = null

describe('Seed test data', () => {
  it('should create and authenticate test users', async () => {
    const user = await models.User.create({
      email: 'test@api4all.com',
      password: 'api4all',
      name: 'user api4all'
    })
    expect(user.id).to.exist
    userId = user.id
    const admin = await models.User.create({
      email: 'admin@api4all.com',
      password: 'api4all',
      name: 'user api4all'
    })
    expect(admin.id).to.exist
    adminId = admin.id
    // create admin-user relation
    const role = await models.Role.findByPk(2)
    if (!role) {
      await models.Role.create({ id: 2, name: 'Admin', description: 'Root access' })
      shouldDeleteRole = 2
    }
    const userRole = await models.UserRole.create({
      userId: adminId,
      roleId: 2
    })
    // create role
    expect(userRole).to.exist
    const tokenRespnse = await request(server).post('/auth/login')
      .send({ email: 'test@api4all.com', password:  'api4all' })
    expect(tokenRespnse.status).to.equal(200)
    expect(tokenRespnse.body.token).to.exist
    userToken = tokenRespnse.body.token
    const adminResponse = await request(server).post('/auth/login')
      .send({ email: 'admin@api4all.com', password:  'api4all' })
    expect(adminResponse.status).to.equal(200)
    expect(adminResponse.body.token).to.exist
    adminToken = adminResponse.body.token
  })
  it ('should create movies', async () => {
    const movie = await models.Movie.create({
      title: 'api4all test movie',
      director: 'api4all test director',
      quantity: 1,
    })
    expect(movie.id).to.exist
    movieId = movie.id
    const secondMovie = await models.Movie.create({
      title: 'api4all second movie',
      director: 'api4all second director',
      quantity: 2,
    })
    expect(secondMovie.id).to.exist
    secondMovieId = secondMovie.id
  })
})


describe('Client Movies Route', () => {
  it('health-check', async () => {
    const response = await request(server).get('/healthcheck/')
    expect(response.status).to.equal(200)
  })
  it('should list movies', async () => {
    const response = await request(server).get('/movies')
      .set('Authorization', `Bearer ${userToken}`)
    expect(response.status).to.equal(200)
    expect(response.body.items).to.exist
    expect(response.body.totalItems).to.be.gt(0)
  }) 
  it('should paginate movies', async () => {
    const response = await request(server).get('/movies?page=1&per_page=1')
      .set('Authorization', `Bearer ${userToken}`)
    expect(response.status).to.equal(200)
    expect(response.body.items).to.exist
    expect(response.body.totalItems).to.exist
    expect(response.body.items.length).to.be.lt(2)
    expect(response.body.items.length).to.be.gt(0)
  }) 
  it('should search movies', async () => {
    const response = await request(server).get('/movies?search=api4all')
      .set('Authorization', `Bearer ${userToken}`)
    expect(response.status).to.equal(200)
    expect(response.body.totalItems).to.exist
    expect(response.body.items).to.exist
    expect(response.body.items.length).to.be.gt(0)
  }) 
  it('should get movie details', async () => {
    const response = await request(server).get(`/movies/${movieId}`)
      .set('Authorization', `Bearer ${userToken}`)
    expect(response.status).to.equal(200)
    expect(response.body).to.exist
    expect(response.body.id).to.equal(movieId)
  })
})

describe('Admin Movies Route', () => {
  it('should create a movie', async () => {
    const response = await request(server).post('/admin/movies')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'admin test movie', director: 'admin test director', quantity: 2})
    expect(response.status).to.equal(200)
    expect(response.body).to.exist
    expect(response.body.id).to.exist
    expect(response.body.quantityAvailable).to.equal(2)
    thirdMovieId = response.body.id
  })
  it('should fail to create a movie', async () => {
    const response = await request(server).post('/admin/movies')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'admin test movie' })
    expect(response.status).to.equal(400)
  })
  it('should update a movie', async () => {
    const response = await request(server).patch(`/admin/movies/${thirdMovieId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 3 })
    expect(response.status).to.equal(200)
    expect(response.body).to.exist
    expect(response.body.id).to.equal(thirdMovieId)
    expect(response.body.quantityAvailable).to.equal(3)
  })
  it('should fail to update a movie', async () => {
    const response = await request(server).patch(`/admin/movies/${thirdMovieId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: -4 })
    expect(response.status).to.equal(400)
  })
  it('Delete a movie', async () => {
    const response = await request(server).delete(`/admin/movies/${thirdMovieId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(response.status).to.equal(200)
    expect(response.body).to.exist
    expect(response.body.id).to.equal(thirdMovieId)
  })
})

describe('Remove movie test data from DB', () => {
  it ('Remove admin and movies user', async () => {
    const user = await models.User.findByPk(userId)
    expect(user.id).to.equal(userId)
    const admin = await models.User.findByPk(adminId)
    expect(admin.id).to.equal(adminId)
    await user.destroy()
    await admin.destroy()
    if(shouldDeleteRole) {
      const role = await models.Role.findByPk(2)
      expect(role).to.exist
      await role.destroy()
    }
    const firstMovie = await models.Movie.findByPk(movieId)
    expect(firstMovie.id).to.equal(movieId)
    await firstMovie.destroy()
    const secondMovie = await models.Movie.findByPk(secondMovieId)
    expect(secondMovie.id).to.equal(secondMovieId)
    await secondMovie.destroy()
  })
})