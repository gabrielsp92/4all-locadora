import Controllers from '../controllers'
import SendErrorResponse from '../helpers/SendErrorResponse'

export default function (operationId) {
 return async function (req, res, next) {
    if (!operationId) {
      return next()
    }
    const [ controller, platform, action ] = operationId.split('-')
    if (!controller || !platform || !action) {
      return next()
    }
    try {
      await Controllers[controller][platform][action](req, res)
    } catch (err) {
      console.error(err)
      SendErrorResponse(err, res)
    }
  }
}