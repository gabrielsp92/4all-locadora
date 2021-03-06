const autoLoad = [
  'Auth',
  'User',
  'Movie',
  'Rent',
]

export default autoLoad.reduce((acc, moduleName) => ({
  ...acc,
  [moduleName]: require(`./${moduleName}`).default,
}), {})
