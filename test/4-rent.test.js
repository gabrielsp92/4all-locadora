
import { expect } from 'chai'
import request  from 'supertest'
import server from '../app'
import models from '../models'

let userId = null
let userToken = ''
let rentId = null
let secondRentId = null
let adminRentId = null
let adminId = null
let adminToken = null
let shouldDeleteRole = false
let movieId = null
let secondMovieId = null

describe('Seed rents test data', () => {
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
      quantity: 3,
    })
    expect(secondMovie.id).to.exist
    secondMovieId = secondMovie.id
  })
})


describe('Client Rents Routes', () =>  {
  it ('should create rent', async () => {
    const response = await request(server).post(`/rents/movie/${movieId}`)
      .set('Authorization', `Bearer ${userToken}`)
    expect(response.status).to.equal(200)
    expect(response.body).to.exist
    expect(response.body.id).to.exist
    rentId = response.body.id
  })
  it ('should create rent as admin', async () => {
    const response = await request(server).post(`/rents/movie/${secondMovieId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(response.status).to.equal(200)
    expect(response.body).to.exist
    expect(response.body.id).to.exist
    adminRentId = response.body.id
  })
  it ('should Fail to Create a rent of the same movie', async () => {
    const response = await request(server).post(`/rents/movie/${movieId}`)
      .set('Authorization', `Bearer ${userToken}`)
    expect(response.status).to.equal(400)
  })
  it ('should Fail to Create rent of an unavailable movie', async () => {
    const response = await request(server).post(`/rents/movie/${movieId}`)
      .set('Authorization', `Bearer ${userToken}`)
    expect(response.status).to.equal(400)
  })
  it ('should get rent details', async () => {
    const response = await request(server).get(`/rents/${rentId}`)
      .set('Authorization', `Bearer ${userToken}`)
    expect(response.status).to.equal(200)
    expect(response.body).to.exist
    expect(response.body.id).to.equals(rentId)
  })
  it ('should fail to get others user rent details', async () => {
    const response = await request(server).get(`/rents/${adminRentId}`)
      .set('Authorization', `Bearer ${userToken}`)
    expect(response.status).to.equal(400)
  })
  it ('should list logged users rents', async () => {
    const response = await request(server).get(`/rents`)
      .set('Authorization', `Bearer ${userToken}`)
    expect(response.status).to.equal(200)
    expect(response.body).to.exist
    expect(response.body.totalItems).to.be.gt(0)
  })
  it ('should return a rent', async () => {
    const response = await request(server).post(`/rents/${rentId}/return`)
      .set('Authorization', `Bearer ${userToken}`)
    expect(response.status).to.equal(200)
    expect(response.body).to.exist
    expect(response.body.deliveredAt).to.exist
    expect(response.body.id).to.equal(rentId)
  })
  it ('should fail to return other users rent', async () => {
    const response = await request(server).post(`/rents/${adminRentId}/return`)
      .set('Authorization', `Bearer ${userToken}`)
    expect(response.status).to.equal(400)
  })
})

describe('Admin Rents Routes', () => {
  it ('should create a rent for another user', async () => {
    const response = await request(server).post(`/admin/rents/movie/${secondMovieId}/user/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(response.status).to.equal(200)
    expect(response.body).to.exist
    expect(response.body.id).to.exist
    expect(response.body.user).to.exist
    expect(response.body.user.id).to.equal(userId)
    expect(response.body.movie).to.exist
    expect(response.body.movie.id).to.equal(secondMovieId)
    secondRentId = response.body.id
  })
  it ('should return another users rent', async () => {
    const response = await request(server).post(`/admin/rents/${secondRentId}/return`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(response.status).to.equal(200)
    expect(response.body).to.exist
    expect(response.body.deliveredAt).to.exist
    expect(response.body.id).to.equal(secondRentId)
  })
  it ('should list every rent', async () => {
    const response = await request(server).get(`/admin/rents`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(response.status).to.equal(200)
    expect(response.body.items).to.exist
    expect(response.body.totalItems).to.be.gt(0)
  })
  it ('should list every rent paginated', async () => {
    const response = await request(server).get(`/admin/rents?per_page=1&page=1"`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(response.status).to.equal(200)
    expect(response.body.items).to.exist
    expect(response.body.totalItems).to.exist
    expect(response.body.items.length).to.be.gt(0)
  })
  it ('should list by movie', async () => {
    const response = await request(server).get(`/admin/rents?movieId=${movieId}"`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(response.status).to.equal(200)
    expect(response.body.items).to.exist
    expect(response.body.totalItems).to.exist
    expect(response.body.items[0].movie.id).to.equals(movieId)
  })
  it ('should list by user', async () => {
    const response = await request(server).get(`/admin/rents?userId=${userId}"`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(response.status).to.equal(200)
    expect(response.body.items).to.exist
    expect(response.body.totalItems).to.exist
    expect(response.body.items.length).to.be.gt(0)
    expect(response.body.items[0].user.id).to.equals(userId)
  })
  it ('should get rents details', async () => {
    const response =  await request(server).get(`/admin/rents/${rentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(response.status).to.equal(200)
    expect(response.body.id).to.equal(rentId)
  })
  it ('should delete rents', async () => {
    const response = await request(server).delete(`/admin/rents/${secondRentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(response.status).to.equal(200)
    expect(response.body.id).to.equal(secondRentId)
  })
})

describe('Remove rents test data from DB', () => {
  it ('Remove users', async () => {
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
  })
  it ('Remove movies', async () => {
    const firstMovie = await models.Movie.findByPk(movieId)
    expect(firstMovie.id).to.equal(movieId)
    await firstMovie.destroy()
    const secondMovie = await models.Movie.findByPk(secondMovieId)
    expect(secondMovie.id).to.equal(secondMovieId)
    await secondMovie.destroy()
  })
  it ('Remove rents', async () => {
    const rent = await models.Rent.findByPk(rentId)
    expect(rent.id).to.equal(rentId)
    const adminRent = await models.Rent.findByPk(adminRentId)
    expect(adminRent.id).to.equal(adminRentId)
    await adminRent.destroy()
    await rent.destroy()
  })
})

