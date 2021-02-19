module.exports = {
  publicPath: "",
  devServer: {
    proxy: 'http://172.18.100.52:5000',
    port: 8080
  },
};