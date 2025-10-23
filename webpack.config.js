const path = require('path');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  mode: 'production',
  entry: './src/content.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'content.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      INFURA_API_KEY: JSON.stringify(process.env.INFURA_API_KEY)
    })
  ]
};
