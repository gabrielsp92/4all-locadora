const autoLoad = [
  'Auth',
]

export default autoLoad.reduce((acc, moduleName) => ({
  ...acc,
  [moduleName]: require(`./${moduleName}`).default,
}), {})
