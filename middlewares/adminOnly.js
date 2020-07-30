export default async (req, res, next) => {
  const { roles } = req.user
  if(!roles.some(({ id }) => id === 2)) {
    return res.status(401).send({ message: 'User not allowed'})
  }
  next()
}
