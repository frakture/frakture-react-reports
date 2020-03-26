module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'frakture_reports',
      externals: {
        react: 'React'
      }
    }
  }
}
