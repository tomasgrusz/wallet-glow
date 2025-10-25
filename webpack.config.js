const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
require('dotenv').config();

const envPlugin = new webpack.DefinePlugin({
      INFURA_API_KEY: JSON.stringify(process.env.INFURA_API_KEY)
  });

const commonConfig = {
  mode: 'production',
  entry: {
    content: './src/content.ts',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

const chromeConfig = {
  ...commonConfig,
  name: 'chrome',
  output: {
    path: path.resolve(__dirname, 'chrome/dist'),
    filename: '[name].js',
    clean: true,
  },
  plugins: [
    envPlugin,
    new CopyPlugin({
      patterns: [
        { from: 'manifest.chrome.json', to: '../manifest.json' },
        { from: 'styles.css', to: '../styles.css' },
        { from: 'icons', to: '../icons' },
      ],
    }),
  ],
};

const firefoxConfig = {
  ...commonConfig,
  name: 'firefox',
  output: {
    path: path.resolve(__dirname, 'firefox'),
    filename: '[name].js',
    clean: true,
  },
  plugins: [
    envPlugin,
    new CopyPlugin({
      patterns: [
        { from: 'manifest.firefox.json', to: 'manifest.json' },
        { from: 'styles.css', to: 'styles.css' },
        { from: 'icons', to: 'icons' },
      ],
    }),
  ],
};

module.exports = [chromeConfig, firefoxConfig];