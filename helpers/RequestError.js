export default class {
  constructor (status, message) {
    return {
      status: message === undefined ? 500 : status,
      message: message === undefined ? status : message,
    }
  }
}
