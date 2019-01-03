const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: ['./src/index.js'],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      // template: 'index.html',
      filename: 'index.html',
    }),
    // new CopyWebpackPlugin([{
    //   from: './src/img/',
    //   to: 'img/'
    // }, {
    //   from: './src/models/',
    //   to: 'models'
    // }])
  ]
};