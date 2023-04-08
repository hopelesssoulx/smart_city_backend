const path = require('path');

module.exports = {
  target: 'node',
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    // publicPath:'/'
    filename: 'bundle.js',
  },
  optimization: {
    minimize: false
  },
  mode: 'production',
};
