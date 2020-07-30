const autoLoad = [
  'admin',
  'client',
]

export default autoLoad.reduce((acc, moduleName) => ({
  ...acc,
  [moduleName]: require(`./${moduleName}`).default,
}), {})
