import MovieService from '../../services/movie'

export default {
  async get(req, res) {
    const { movieId } = req.params
    const result = await MovieService.getMovie(movieId)
    res.send(result)
  },
  async list(req, res) {
    const result = await MovieService.listMovies(req.query)
    res.send(result)
  },
}