const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

const fs = require('fs');

const nodeModules = {};
fs.readdirSync('node_modules')
.filter(x => ['.bin'].indexOf(x) === -1)
.forEach(mod => { nodeModules[mod] = 'commonjs ' + mod; });

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  module: {
    rules,
  },
  externals: nodeModules,
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
  },
};
