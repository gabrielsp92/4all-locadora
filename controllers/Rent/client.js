import RentService from '../../services/rent'

export default {
  async get(req, res) {
    const { rentId } = req.params
    const { id } = req.user
    const result = await RentService.getRent(rentId, id)
    res.send(result)
  },
  async list(req, res) {
    const { id } = req.user
    req.query.userId = id // force only user`s records
    const result = await RentService.listRents(req.query)
    res.send(result)
  },
  async returnRent(req, res) {
    const { rentId } = req.params
    const { id } = req.user
    const result = await RentService.returnRent(rentId, id)
    res.send(result)
  },
  async createRent(req, res) {
    const { movieId } = req.params
    const { id } = req.user
    const result = await RentService.createRent(movieId, id)
    res.send(result)
  }
}