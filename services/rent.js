import RequestError from '../helpers/RequestError'
import models from '../models'
import Sequelize from 'sequelize'

const Op = Sequelize.Op

const selectionScope = {
  include: [
    { model: models.User, as: 'user', attributes: ['id', 'name', 'email'] },
    { model: models.Movie, as: 'movie', attributes: ['id', 'title', 'director'] },
  ],
  attributes: {
    exclude: ['userId', 'movieId', 'updatedAt']
  },
} 

export default {
  async getRent(rentId, agentId) {
    if (!rentId) throw new RequestError(400, 'Informe o Id da locação')
    let query = { where: { id: rentId } }
    // if agentId is given it should validate if it belongs to him
    if (agentId) query.where.userId = agentId
    const result = await models.Rent.findOne({ ...query, ...selectionScope })
    if (!result) throw new RequestError(400, 'Locação não encontrada')
    return result
  },
  async listRents (query) {
    let { page, per_page, search, sortBy, descending, userId, movieId, onlyOpened, onlyClosed } = query
    page = parseInt(page) || 1
    per_page = parseInt(per_page) || 10
    let findQuery = {
      offset: (page - 1) * per_page,
      limit: per_page,
      attributes: ['id', 'movieId', 'userId', 'deliveredAt', 'createdAt'],
      where: {},
    }
    if (sortBy) {
      findQuery.order = [
        [sortBy, descending == 'true' ? 'DESC' : 'ASC']
      ]
    }
    if (userId) {
      userId = parseInt(userId) || undefined
      findQuery.where.userId = userId
    }
    if (movieId) {
      movieId = parseInt(movieId) || undefined
      findQuery.where.movieId = movieId
    }
    console.log({movieId})
    if (search) {}
    if (onlyOpened == 'true') {
      findQuery.where.deliveredAt = { [Op.is]: null }
    }
    if (onlyClosed == 'true') {
      findQuery.where.deliveredAt = { [Op.not]: null }
    }
    const items = await models.Rent.findAll({...findQuery, ...selectionScope})
    const totalItems = await models.Rent.count({ where: findQuery.where })
    return {
      page,
      per_page,
      totalItems,
      items
    }
  },
  async returnRent(rentId, agentId) {
    if (!rentId) throw new RequestError(400, 'Informe o Id da locação')
    let query = { where: { id: rentId } }
    // if agentId is given it should validate if it belongs to him
    if (agentId) query.where.userId = agentId
    const rent = await models.Rent.findOne({ ...query, ...selectionScope })
    if (!rent) throw new RequestError(400, 'Locação não encontrada')
    if (rent.deliveredAt) return rent
    rent.deliveredAt = new Date()
    await rent.save()
    // Change quantity available in movie
    await models.Movie.increment('quantityAvailable', { where: { id: rent.movie.id } })
    return rent
  },
  async createRent(movieId, userId) {
    await validatePostParams(movieId, userId)
    const rent = await models.Rent.create({
      movieId: movieId,
      userId: userId,
    })
    // Change quantity available in movie
    await models.Movie.decrement('quantityAvailable', { where: { id: movieId } })
    const formattedRent = await models.Rent.findOne({  where: { id: rent.id }, ...selectionScope })
    return formattedRent
  },
  async deleteRent(rentId) {
    if (!rentId) throw new RequestError(400, 'Informe o ID da locação desejada')
    const rent = await models.Rent.findOne({ where: { id: rentId }, ...selectionScope })
    if (!rent) throw new RequestError(400, 'Locação não encontrada')
    await rent.destroy()
    return rent
  },
}

async function validatePostParams(movieId, userId) {
  if (!movieId) throw new RequestError(400, 'Informe o id do filme')
  if (!userId) throw new RequestError(400, 'Informe o id do usuário')
  const movie = await models.Movie.findByPk(movieId)
  if (!movie) throw new RequestError(400, 'Filme não encontrado')
  if(movie.quantityAvailable <= 0) throw new RequestError(400, 'Filme não disponível no momento, todas as unidades já estão alugadas')
  const user = await models.User.findByPk(userId)
  if (!user) throw new RequestError(400, 'Usuário não encontrado')
  // Validate if there is an open rent with the same movie
  const isRentOpened = await models.Rent.findOne({ where: { movieId, userId, deliveredAt: null }})
  if (isRentOpened) throw new RequestError(400, 'Já existe uma locação aberta com esse filme')
}