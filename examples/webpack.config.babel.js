import webpack from 'webpack';
import fs from 'fs';
import { resolve, join } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';

export default env => {
  return {
    // ------------------------------------
    // Entry Points
    // ------------------------------------
    entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
      if (fs.statSync(join(__dirname, dir)).isDirectory())
        entries[dir] = join(__dirname, dir, 'app.jsx')
      return entries
    }, {}),

    // ------------------------------------
    // Devtool
    // ------------------------------------
    devtool: 'inline-source-map',

    // ------------------------------------
    // Resolve
    // ------------------------------------
    resolve: {
      extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.json'],
      modules: [
        // resolve(__dirname, '../src'),
        resolve(__dirname, '../node_modules')
      ],
      alias: {
        'react-localize-redux': resolve(__dirname, '../src')
      }
    },

    // ------------------------------------
    // Output
    // ------------------------------------
    output: {
      path: __dirname + '/__build__',
      filename: '[name].js',
      chunkFilename: '[id].chunk.js',
      publicPath: '/__build__/'
    },

    // ------------------------------------
    // Devserver
    // ------------------------------------
    devServer: {
      historyApiFallback: true,
      stats: {
        chunkModules: false
      }
    },

    // ------------------------------------
    // Module
    // ------------------------------------
    module: {
      rules: [
        { 
          test: /\.js(x?)$/, 
          loaders: [ 'babel-loader' ], 
          exclude: /node_modules/ 
        },
        { 
          test: /\.json$/, 
          loaders: [ 'json-loader' ], 
          exclude: /node_modules/ 
        }
      ]
    },

    context: __dirname,

    // ------------------------------------
    // Plugins
    // ------------------------------------
    plugins: [
      new ProgressBarPlugin(),

      new webpack.optimize.CommonsChunkPlugin({
        name: 'shared',
        filename: 'shared.js'
      }),

      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      })
    ]
  }
}
