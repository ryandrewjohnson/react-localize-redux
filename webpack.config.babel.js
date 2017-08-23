import webpack from 'webpack';
import { resolve } from 'path';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import { getIfUtils, removeEmpty } from 'webpack-config-utils';

export default env => {
  const { ifProd, ifNotProd } = getIfUtils(env);
  const reactExternal = {
    root: 'React',
    commonjs2: 'react',
    commonjs: 'react',
    amd: 'react'
  };
  const reduxExternal = {
    root: 'Redux',
    commonjs2: 'redux',
    commonjs: 'redux',
    amd: 'redux'
  };
  const reactReduxExternal = {
    root: 'ReactRedux',
    commonjs2: 'react-redux',
    commonjs: 'react-redux',
    amd: 'react-redux'
  };
  // const reselectExternal = {
  //   root: 'Reselect',
  //   commonjs2: 'reselect',
  //   commonjs: 'reselect',
  //   amd: 'reselect'
  // };
  return {
   entry: './src/index.js',

    resolve: {
      extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.json'],
      modules: [
        resolve(__dirname, 'src'),
        resolve(__dirname, 'node_modules')
      ]
    },

    output: {
      library: 'ReactLocalizeRedux',
      libraryTarget: 'umd'
    },

    externals: {
      'react': reactExternal,
      'redux': reduxExternal,
      'react-redux': reactReduxExternal,
      // 'reselect': reselectExternal
    },

    module: {
      rules: removeEmpty([
        { 
          test: /\.js(x?)$/, 
          loaders: [ 'babel-loader' ], 
          exclude: /node_modules/ 
        }
      ])
    },

    plugins: removeEmpty([
      new ProgressBarPlugin(),
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
        }
      }))
    ])
  }
}
