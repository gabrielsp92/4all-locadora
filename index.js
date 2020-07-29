import models from './models'

const Op = models.Sequelize.Op

models.Movie.findAll().then(console.log)
models.User.findAll().then(console.log)

console.log('hi')