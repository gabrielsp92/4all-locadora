import UserService from '../../services/user'

export default {
  async get(req, res) {
    const { userId } = req.params
    const result = await UserService.getUser(userId)
    res.send(result)
  },
  async list(req, res) {
    const result = await UserService.listUsers(req.query )
    res.send(result)
  },
  async patch(req, res) {
    const { userId } = req.params
    const result = await UserService.patchUser(userId, req.body)
    res.send(result)
  },
  async create(req, res) {
    const result = await UserService.createUser(req.body)
    res.send(result)
  },
  async delete(req, res) {
    const { userId } = req.params
    const result = await UserService.deleteUser(userId)
    res.send(result)
  },
  async promote(req, res) {
    const { userId } = req.params
    const result = await UserService.promoteToAdmin(userId)
    res.send(result)
  },
  async demote(req, res) {
    const { userId } = req.params
    const result = await UserService.demoteToClient(userId)
    res.send(result)
  }
}