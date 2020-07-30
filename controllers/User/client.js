import UserService from '../../services/user'

export default {
  async patch(req, res) {
    const { id } = req.user
    const result = await UserService.patchUser(id, req.body)
    res.send(result)
  },
}