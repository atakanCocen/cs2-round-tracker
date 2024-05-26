const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './app.js',
  mode: 'development',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: './dist'
  },
  plugins: [
    new CopyPlugin(
      {
        patterns: [
          { from: 'pages/home/index.html', to: './'},
          { from: 'public/assets/css/images/main.css', to: './'},
          { from: 'pages/home/home.js', to: './home.js'},
          { from: 'pages/stats/stats.html', to: '/stats'},
          { from: 'pages/stats/stats.js', to: './stats.js'}
        ]
      }),
  ],
};