const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin');
var StringReplacePlugin = require("string-replace-webpack-plugin");

module.exports = {
  entry: {
    // For Chrome
    'chrome/dist/sentry': './src/sentry',
    'chrome/dist/ts-lib': './src/ts-lib',
    'chrome/dist/background': './src/background',
    'chrome/dist/github': './src/platforms/github',
    'chrome/dist/gitlab': './src/platforms/gitlab',
    'chrome/dist/bitbucket': './src/platforms/bitbucket',

    // For Safari
    'intelli-octo.safariextension/dist/sentry': './src/sentry',
    'intelli-octo.safariextension/dist/ts-lib': './src/ts-lib',
    'intelli-octo.safariextension/dist/background': './src/background',
    'intelli-octo.safariextension/dist/content': './src/content',
  },
  output: {
    path: path.resolve('.'),
    filename: '[name].js'
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  module: {
    rules: [
      {
        // This is an ugly hack to prevent require error
        test: /node_modules\/vscode.*\.js$/,
        loader: StringReplacePlugin.replace({
          replacements: [
            {
              pattern: /factory\(require, exports\)/g,
              replacement: function (match, p1, offset, string) {
                return 'factory(null, exports)'
              }
            },
            {
              pattern: /function \(require, exports\)/,
              replacement: function (match, p1, offset, string) {
                return 'function (UnUsedVar, exports)'
              }
            }
          ]
        })
      },
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },

  // https://github.com/postcss/postcss-js/issues/10#issuecomment-179782081
  node: { fs: 'empty' },
  plugins: [
    new CleanWebpackPlugin(['chrome/dist', 'intelli-octo.safariextension/dist']),
    new StringReplacePlugin()
  ]
}
