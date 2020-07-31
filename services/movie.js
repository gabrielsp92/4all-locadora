import RequestError from '../helpers/RequestError'
import models from '../models'
import Sequelize from 'sequelize'

const Op = Sequelize.Op

export default {
  async createMovie(payload) {
    const params = validatePostParams(payload)
    const movie = await models.Movie.create(params)
    return movie
  },
  async getMovie(id) {
    if (!id) throw new RequestError(400, 'Informe o ID do filme desejado')
    const movie = await models.Movie.findByPk(id)
    if (!movie) throw new RequestError(400, 'Filme não encontrado')
    return movie
  },
  async patchMovie(id, payload) {
    if (!id) throw new RequestError(400, 'Informe o ID do filme desejado')
    const movie = await models.Movie.findByPk(id)
    if (!movie) throw new RequestError(400, 'Filme não encontrado')
    let params = await validatePatchParams(movie, payload) 
    await models.Movie.update(params, { where: { id } })
    await movie.reload()
    return movie
  },
  async deleteMovie(id) {
    if (!id) throw new RequestError(400, 'Informe o ID do filme desejado')
    const movie = await models.Movie.findByPk(id)
    if (!movie) throw new RequestError(400, 'Filme não encontrado')
    await movie.destroy()
    return movie
  },
  async listMovies(query) {
    let { page, per_page, search, sortBy, descending, onlyAvailables, onlyUnavailables } = query
    page = parseInt(page) || 1
    per_page = parseInt(per_page) || 10
    let findQuery = {
      offset: ( page - 1 ) * per_page,
      limit: per_page,
      where: {},
    }
    if (sortBy) {
      findQuery.order = [
        [sortBy, descending == 'true' ? 'DESC' : 'ASC']
      ]
    }
    if (search) {
      // search with case insensitive
      let lowerSearch = search.toLowerCase()
      findQuery.where = {
        [Op.or]: [
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.col('title')),
            {
              [Op.like]: `%${lowerSearch}%`
            }
          ),
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.col('director')),
            {
              [Op.like]: `%${lowerSearch}%`
            }
          ),
        ]
      }
    }
    if (onlyUnavailables == 'true') {
      findQuery.where.quantityAvailable = { [Op.lt]: 1, }
    }
    if (onlyAvailables == 'true') {
      findQuery.where.quantityAvailable = { [Op.gt]: 0, }
    }
    const items = await models.Movie.findAll(findQuery)
    const totalItems = await models.Movie.count({ where: findQuery.where })
    return {
      page,
      per_page,
      totalItems,
      items
    }
  },
}

function validatePostParams(payload) {
  let params = {}
  const { title, director, quantity } = payload
  if (!title) throw new RequestError(400, 'Informe o título do filme')
  params.title = title
  if (!director) throw new RequestError(400, 'Informe o título do filme')
  params.director = director
  if (!quantity) throw new RequestError(400, 'Informe o título do filme')
  params.quantity = quantity
  return params
}
function validatePatchParams(movie, payload) {
  let params = {}
  const { title, director, quantity } = payload
  if (title && title !== movie.title) params.title = title
  if (director && director !== movie.director) params.director = director
  if (quantity !== undefined && quantity !== movie.quantity) {
    params.quantity = quantity
    // change available quantity
    const difference = quantity - movie.quantity
    params.quantityAvailable = movie.quantityAvailable + difference
    if (params.quantityAvailable < 0) params.quantityAvailable = 0
  }
  return params
}