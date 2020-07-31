import RentService from '../../services/rent'

export default {
  async get(req, res) {
    const { rentId } = req.params
    const result = await RentService.getRent(rentId)
    res.send(result)
  },
  async list(req, res) {
    const result = await RentService.listRents(req.query)
    res.send(result)
  },
  async returnRent(req, res) {
    const { rentId } = req.params
    const result = await RentService.returnRent(rentId)
    res.send(result)
  },
  async createRent(req, res) {
    const { movieId, userId } = req.params
    const result = await RentService.createRent(movieId, userId)
    res.send(result)
  },
  async delete(req, res) {
    const { rentId } = req.params
    const result = await RentService.deleteRent(rentId)
    res.send(result)
  }
}