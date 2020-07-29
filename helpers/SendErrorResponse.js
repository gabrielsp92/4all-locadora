export default function (err, res) {
  if (err.status && err.message) {
    return res.status(err.status).send({message: err.message})
  } else if (err.message) {
    return res.status(500).send({message: err.message}) 
  } else {
    return res.status(500).send({message: 'Server Error'})
  }
}