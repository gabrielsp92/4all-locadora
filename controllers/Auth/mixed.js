import AuthService from '../../services/auth'

export default {
  async login (req, res) {
    const result = await AuthService.signIn(req.body)
    res.send(result)
  },
  async me (req, res) {
    const result = await AuthService.me(req.user)
    res.send(result)
  },
  async logout (req, res) {
    await AuthService.logout(req.user)
    res.send({message: 'Usuário Desconectado'})
  },
  async refresh (req, res) {
    const result = await AuthService.refreshToken(req.user)
    res.send(result)
  }
}