module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/assets/variables.scss";'
      }
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/teeter-totter-insider/'
    : '/'
}
