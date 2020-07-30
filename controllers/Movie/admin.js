import MovieService from '../../services/movie'

export default {
  async patch(req, res) {
    const { movieId } = req.params
    const result = await MovieService.patchMovie(movieId, req.body)
    res.send(result)
  },
  async create(req, res) {
    const result = await MovieService.createMovie(req.body)
    res.send(result)
  },
  async delete(req, res) {
    const { movieId } = req.params
    const result = await MovieService.deleteMovie(movieId)
    res.send(result)
  },
}