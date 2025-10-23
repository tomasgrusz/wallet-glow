const path = require('path');

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
  }
};
