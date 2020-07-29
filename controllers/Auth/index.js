const autoLoad = [
  'mixed',
]

export default autoLoad.reduce((acc, moduleName) => ({
  ...acc,
  [moduleName]: require(`./${moduleName}`).default,
}), {})
