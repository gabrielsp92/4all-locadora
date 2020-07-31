
import { expect } from 'chai'
import request  from 'supertest'
import server from '../app'
import models from '../models'

let userId = null
let userToken = ''
let adminId = null
let adminToken = null
let shouldDeleteRole = false

describe('Seed test data', () => {
  it('should create and authenticate test user', async () => {
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
})


describe('Middleware role validation test', () => {
  it('should fail to pass admin security as client', async () => {
    const response = await request(server).put(`/admin/users/${userId}/promote`)
      .set('Authorization', `Bearer ${userToken}`)
    expect(response.status).to.equal(401)
  })
})

describe('Client Users Route', () => {
  it('should update logged user ', async () => {
    const response = await request(server).patch(`/users`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'UpdatedName' })
    expect(response.status).to.equal(200)
    expect(response.body).to.exist
    expect(response.body.id).to.equal(userId)
    expect(response.body.name).to.equal('UpdatedName')
  })
  it('should fail to update users email', async () => {
    const response = await request(server).patch(`/users`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ email: 'admin@api4all.com' })
    expect(response.status).to.equal(400)
  })
  it('should fail to update users password', async () => {
    const response = await request(server).patch(`/users`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ password: 'api' })
    expect(response.status).to.equal(400)
  })
  it('should update users password', async () => {
    const response = await request(server).patch(`/users`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ password: 'api4all*' })
    expect(response.status).to.equal(200)
    expect(response.body).to.exist
    const user = await models.User.findByPk(userId)
    expect(user.password).to.exist
    const isValid = await models.User.validatePassword('api4all*', user.password)
    expect(isValid).to.be.true
  })
})

describe('Admin Users Route', () => {
  it('should list users', async () => {
    const response = await request(server).get('/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(response.status).to.equal(200)
    expect(response.body.totalItems).to.exist
    expect(response.body.totalItems).to.be.gt(0)
  })
  it('should list users with pagination', async () => {
    const response = await request(server).get('/admin/users?page=1&per_page=1&search=user')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(response.status).to.equal(200)
    expect(response.body.totalItems).to.exist
    expect(response.body.items).to.exist
    expect(response.body.items.length).to.be.lt(2)
    expect(response.body.items.length).to.be.gt(0)
  })
  it('should search users', async () => {
    const response = await request(server).get('/admin/users?search=test@api4all.com')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(response.status).to.equal(200)
    expect(response.body.totalItems).to.exist
    expect(response.body.items).to.exist
    expect(response.body.items.length).to.be.gt(0)
    const user = response.body.items[0]
    expect(user.id).to.equal(userId)
  })
  it('should update users', async () => {
    const response = await request(server).patch(`/admin/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'new name' } )
    expect(response.status).to.equal(200)
    expect(response.body).to.exist
    expect(response.body.name).to.equal('new name')
  })
  it('should promote users', async () => {
    const response = await request(server).put(`/admin/users/${userId}/promote`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(response.status).to.equal(200)
    expect(response.body).to.exist
    expect(response.body.roles).to.exist
    const isAdmin = response.body.roles.some(({ name }) => name.toLowerCase() == 'admin')
    expect(isAdmin).to.be.true
  })
  it('should demote users', async () => {
    const response = await request(server).put(`/admin/users/${userId}/demote`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(response.status).to.equal(200)
    expect(response.body).to.exist
    expect(response.body.roles).to.exist
    const isAdmin = response.body.roles.some(({ name }) => name.toLowerCase() == 'admin')
    expect(isAdmin).to.be.false
  })
  it('should delete users', async () => {
    const response = await request(server).delete(`/admin/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(response.status).to.equal(200)
    expect(response.body).to.exist
    expect(response.body.id).to.equal(userId)
  })
})

describe('Remove test data from DB', () => {
  it ('Remove admin user', async () => {
    const user = await models.User.findByPk(adminId)
    await user.destroy()
    expect(user.id).to.equal(adminId)
    if(shouldDeleteRole) {
      const role = await models.Role.findByPk(2)
      expect(role).to.exist
      await role.destroy()
    }
  })
})