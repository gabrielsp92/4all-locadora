import RequestError from '../helpers/RequestError'
import models from '../models'
import Sequelize from 'sequelize'

const Op = Sequelize.Op

// Default Options
const selectionScope = { attributes: { exclude: ['password', 'refreshToken'] } }
const includeRoles = [ { model: models.Role, as: 'roles', through: { attributes: [] }, attributes: { exclude: [ 'createdAt', 'updatedAt'] } } ]

// Service
export default {
  async patchUser(id, payload) {
    if (!id) throw new RequestError(400, 'Informe o Id do usuário')
    let user = await models.User.findByPk(id, selectionScope)
    if (!user) throw new RequestError(400, 'Usuário não encontrado')
    let params = await validatePatchParams(user, payload) 
    await models.User.update(params, { where: { id } })
    await user.reload(selectionScope)
    return user
  },
  async getUser(id) {
    if (!id) throw new RequestError(400, 'Informe o Id do usuário')
    const user = await models.User.findByPk(id, { ...selectionScope, include: includeRoles })
    if (!user) throw new RequestError(400, 'Usuário não encontrado')
    return user
  },
  async listUsers(query) {
    let { page, per_page, search, sortBy, descending } = query
    page = parseInt(page) || 1
    per_page = parseInt(per_page) || 10
    let findQuery = {
      offset: ( page - 1 ) * per_page,
      limit: per_page,
      attributes: {
        exclude: ['password', 'refreshToken'],
      },
      include: includeRoles
    }
    if (search) {
      // search with case insensitive
      let lowerSearch = search.toLowerCase()
      findQuery.where = {
        [Op.or]: [
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.col('name')),
            {
              [Op.like]: `%${lowerSearch}%`
            }
          ),
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.col('email')),
            {
              [Op.like]: `%${lowerSearch}%`
            }
          ),
        ]
      }
    }
    if (sortBy) {
      findQuery.order = [
        [sortBy, descending == 'true' ? 'DESC' : 'ASC']
      ]
    }
    const items = await models.User.findAll(findQuery)
    const totalItems = await models.User.count({ where: findQuery.where })
    return {
      page,
      per_page,
      totalItems,
      items
    }
  },
  async createUser(payload) {
    const params = await validatePostParams(payload)
    const user = await models.User.create(params, selectionScope)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  },
  async deleteUser(id){
    if (!id) throw new RequestError(400, 'Informe o Id do usuário')
    const user = await models.User.findByPk(id, selectionScope)
    if (!user) throw new RequestError(400, 'Usuário não encontrado')
    await user.destroy()
    return user
  },
  async promoteToAdmin(id) {
    if (!id) throw new RequestError(400, 'Informe o Id do usuário')
    const user = await models.User.findByPk(id, { ...selectionScope, include: includeRoles })
    if (!user) throw new RequestError(400, 'Usuário não encontrado')
    if (user.roles.some(({ id }) => id == 2)) return user
    // create admin relation
    await models.UserRole.create({
      userId: user.id, // User Id
      roleId: 2, // Default Admin ID
    })
    return user.reload({...selectionScope, include: includeRoles})
  },
  async demoteToClient(id) {
    if (!id) throw new RequestError(400, 'Informe o Id do usuário')
    const user = await models.User.findByPk(id, { ...selectionScope, include: includeRoles })
    if (!user) throw new RequestError(400, 'Usuário não encontrado')
    if (!user.roles.some(({ id }) => id == 2)) return user
    // delete admn relation
    const userRole = await models.UserRole.findOne({ where: { userId: user.id, roleId: 2 } })
    if (userRole) await userRole.destroy()
    // add client relation
    if (user.roles.some(({ id }) => id == 1)) return user.reload({...selectionScope, include: includeRoles})
    await models.UserRole.create({
      userId: user.id, // User Id
      roleId: 1, // Default Admin ID
    })
    return user.reload({...selectionScope, include: includeRoles})
  },
}

async function validatePatchParams(user, payload) {
  const { name, email, password } = payload
  let params = {}
  if (name) params.name = name
  if (password) {
    if (password.length < 5) throw new RequestError(400, 'A senha deve ter pelo menos 5 caractéres')
    params.password = await models.User.generateHash(password)
  }
  if (email && email !== user.email) {
    //validate email
    const isEmailTaken = await models.User.findOne({ where: {email} })
    if (isEmailTaken) throw new RequestError(400, 'o Email já está em uso')
    params.email = email
  }
  return params 
}

async function validatePostParams(payload) { 
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