const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
// const configJson = require('./webpack.config.json');

module.exports = (env) => {
  const { noMinimize } = env;
  const plugins = [];

  plugins.push(new ExtractTextPlugin({ filename: 'app.css', allChunks: true }));
  plugins.push(new webpack.optimize.CommonsChunkPlugin({ name: 'lib' }));
  if (noMinimize) {
    plugins.push(new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('development') } }));
  } else {
    plugins.push(new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }));
    plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false, pure_funcs: ['console.log'] } }));
  }

  const ROOT_PATH = path.resolve(__dirname);
  // const SRC_PATH = path.resolve(ROOT_PATH, './ui-src');
  const DIST_PATH = path.resolve(ROOT_PATH, '../ui-dist');

  return {
    entry: {
      app: './ui-src/app.jsx',
      lib: './wp/vendor.js',
    },

    output: {
      path: DIST_PATH,
      filename: '[name].js',
    },

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          query: { presets: ['airbnb', 'env', 'react', 'stage-0'] },
          exclude: /(node_modules)/,
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader',
          }),
        },
        {
          test: /\.(png|jpg|ico|gif)$/,
          loader: 'file-loader?name=img/[name].[ext]',
        },
        {
          test: /\.(html|pdf)$/,
          loader: 'file-loader?name=[name].[ext]',
        },
      ],
    },
    plugins,
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: ['node_modules'],
    },
  };
};
