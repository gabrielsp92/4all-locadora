import { jwtSecret } from '../config/vars'
import jwt from 'jsonwebtoken'
import RequestError from '../helpers/RequestError'
import models from '../models'
import { uid } from 'rand-token'

export default {
  async createToken(user) {
    validateTokenParams(user)
    const { id, name, email, refreshToken } = user
    const current_time = parseInt(Date.now() / 1000);
    const expirationDate = current_time + 60 * 60 * 24 * 3 // token will last for 3 days
    const token = jwt.sign({
      id, name, email, expirationDate, refreshToken 
    }, jwtSecret)
    return token
  },
  async refreshToken(payload) {
    const { id, refreshToken } = payload
    const user = await models.User.findByPk(id)
    if (!user) throw new RequestError(401, 'user not found')
    if (!user.refreshToken || user.refreshToken != refreshToken) throw new RequestError(401,'invalid token')
    user.refreshToken = uid(32)
    await user.save()
    const token = await this.createToken(user)
    return { token }
  },
  async logout(payload) {
    const { id } = payload
    const user = await models.User.findByPk(id)
    if (!user) throw new RequestError(400, 'usuário nao encontrado')
    user.refreshToken = ''
    await user.save()
    return { message: 'Succesful Operation' }
  },
  async signIn(payload) {
    validateSignInParams(payload)
    const { email, password } = payload
    const user = await models.User.authenticateByEmailAndPassword(email, password)
    // generate token
    if (!user.refreshToken) {
      let refreshToken = uid(32)
      user.refreshToken = refreshToken
      await user.save()
    }
    const token = await this.createToken(user)
    return {token, roles: user.roles}
  },
  async me(payload) {
    const { id } = payload
    if (!id) throw new RequestError(400, 'user or id not found')
    const user = await models.User.findByPk(id, {
      attributes: {
        exclude: ['refreshToken', 'password']
      }
    })
    if (!user) throw new RequestError(400, 'Usuário não encontrado')
    return user
  },
  async register(payload) {
    const params = await validateRegisterParams(payload)
    const user = await models.User.create(params)
    return {
      name: user.name,
      email: user.email,
    }
  }
}

function validateSignInParams ({email, password}) {
  if (!email) throw new RequestError (400, 'Informe o email do usuário')
  if (!password) throw new RequestError (400, 'Informe a senha do usuário')
}

function validateTokenParams(payload) {
  const { id, name, email } = payload
  if (!id) throw new RequestError(400, 'id is required')
  if (!name) throw new RequestError(400, 'name is required')
  if (!email) throw new RequestError(400, 'email is required')
  return
}

async function validateRegisterParams(payload) { 
  const { name, email, password } = payload
  let params = {}
  if (!name) throw new RequestError(400, 'Informe o Nome do Usuário')
  params.name = name
  if (!email) throw new RequestError(400, 'Informe o email do usuário')
  const emailIsAlreadyTaken = await models.User.findOne({ where: { email } })
  if (emailIsAlreadyTaken) throw new RequestError(400, 'O email já está sendo utlizado')
  params.email = email
  if (!password) throw new RequestError(400, 'Informe a senha para autenticação')
  if (password.length < 5) throw new RequestError(400, 'A senha deve ter pelo menos 5 caractéres')
  params.password = password
  return params
}