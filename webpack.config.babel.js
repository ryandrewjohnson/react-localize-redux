import webpack from 'webpack';
import { resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import { getIfUtils, removeEmpty } from 'webpack-config-utils';

export default env => {
  const { ifProd, ifNotProd } = getIfUtils(env);
  return {
    // ------------------------------------
    // Entry Points
    // ------------------------------------
    entry: {
      library: resolve(__dirname, 'src/index'),
      examples: resolve(__dirname, 'examples/index')
    },

    // ------------------------------------
    // Devtool
    // ------------------------------------
    devtool: ifProd('source-map', 'eval-source-map'),

    // ------------------------------------
    // Resolve
    // ------------------------------------
    resolve: {
      extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.json'],
      modules: [
        resolve(__dirname, 'src'),
        resolve(__dirname, 'node_modules')
      ]
    },

    // ------------------------------------
    // Output
    // ------------------------------------
    output: {
       filename: '[name].js'
      // library: 'ReactLocalizeRedux',
      // libraryTarget: 'umd'
    },

    // externals: {
    //   "react": "React",
    //   "react-redux": true,
    //   "redux": true
    // },

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
      rules: removeEmpty([
        { 
          test: /\.js(x?)$/, 
          loaders: [ 'babel-loader' ], 
          exclude: /node_modules/ 
        }
      ])
    },

    // ------------------------------------
    // Plugins
    // ------------------------------------
    plugins: removeEmpty([
      new ProgressBarPlugin(),

      new HtmlWebpackPlugin({
        template: resolve(__dirname, 'examples/index.html')
      }),

      // This informs certain dependencies e.g. React that they should be compiled for prod
      // see https://github.com/facebook/react/issues/6479#issuecomment-211784918
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: ifProd('"production"', '"development"')
        }
      }),

      ifProd(new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: true
      })),

      ifProd(new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false
        },
        sourceMap: true
      }))
    ])
  }
}
