const fs = require('fs');

const nodeModules = {};
fs.readdirSync('node_modules')
.filter(x => ['.bin'].indexOf(x) === -1)
.forEach(mod => { nodeModules[mod] = 'commonjs ' + mod; });

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  externals: nodeModules,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
  },
};
