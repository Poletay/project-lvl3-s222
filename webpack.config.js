const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: ['./src/index.js', './src/scss/style.scss'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
      },
      {
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, 'src/scss'),
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true,
              minimize: true,
              url: false,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          }],
        }),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: './css/style.bundle.css',
      allChunks: true,
    }),
    new HtmlWebpackPlugin({
      title: 'RSS Reader. 1st Hexlet\'s frontend Project.',
    }),
  ],
};
