import 'regenerator-runtime'
import { expect } from 'chai'
import request  from 'supertest'
import server from '../app'
import models from '../models'

let userId = null
let userEmail = 'test@api4all.com'
let userPassword = 'api4all'
let bearerToken = ''
let secondToken = ''

describe('health-check', () => {
  it('health-check', async () => {
    const response = await request(server).get('/healthcheck/')
    expect(response.status).to.equal(200)
  })
})

describe("Register", () => {
  it('should register a new user', async () => {
    const response = await request(server).post('/auth/register')
      .send({ email: userEmail, password: userPassword, name: 'api4all' })
    expect(response.status).to.equal(200)
    expect(response.body.id).to.exist
    userId = response.body.id
  })
  it('should fail to register a user with a taken email', async () => {
    const response = await request(server).post('/auth/register')
      .send({ email: userEmail, password: userPassword, name: 'api4all' })
    expect(response.status).to.equal(400)
  })
  it('should fail to register a user with password with less then 5 charcters', async () => {
    const response = await request(server).post('/auth/register')
      .send({ email: 'sampleEmail@api4all.com', password: 'api', name: 'api4all' })
    expect(response.status).to.equal(400)
  })
})

describe('Auth', () => {
  it('should authenticate a user', async () => {
    const response = await request(server).post('/auth/login')
      .send({ email: userEmail, password: userPassword })
    expect(response.status).to.equal(200)
    expect(response.body.token).to.exist
    bearerToken = response.body.token
  }),
  it('should fails to authorize user with wrong password', async () => {
    const response = await request(server).post('/auth/login')
      .send({ email: userEmail, password: 'api5all' })
    expect(response.status).to.equal(400)
  })
  it('should bring logged users information', async () => {
    const response = await request(server).get('/auth/me')
      .set('Authorization', `Bearer ${bearerToken}`)
    expect(response.status).to.equal(200)
    expect(response.body.id).to.equal(userId)
  })
  it('should refreh a users token', async () => {
    const response = await request(server).get('/auth/refresh')
      .set('Authorization', `Bearer ${bearerToken}`)
    expect(response.status).to.equal(200)
    expect(response.body.token).to.exist
    secondToken = response.body.token
  })
  it('should fails to refresh with invalid token', async () => {
    const response = await request(server).get('/auth/refresh')
      .set('Authorization', `Bearer ${bearerToken}`)
    expect(response.status).to.equal(401)
  })
  it('should logout a user', async () => {
    const response = await request(server).post('/auth/logout')
      .set('Authorization', `Bearer ${secondToken}`)
    expect(response.status).to.equal(200)
  })
  it('should fails to refresh after logout', async () => {
    const response = await request(server).get('/auth/refresh')
      .set('Authorization', `Bearer ${secondToken}`)
    expect(response.status).to.equal(401)
  })
})

describe('Remove Auth test data from DB', async () => {
  it ('should delete test data', async () => {
    const user = await models.User.findByPk(userId)
    await user.destroy()
    expect(user.id).to.equal(userId)
  })
})