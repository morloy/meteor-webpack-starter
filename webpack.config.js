const meteorExternals = require('webpack-meteor-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const mainHtml = 'client/main.html';
const meteor = 'http://localhost:4000';

const client = ({ isDevelopment }) => ({
  entry: [
    ...(isDevelopment ? ['react-hot-loader/patch'] : []),
    './client/main.css',
    './client/run.js',
    ...(isDevelopment ? ['./client/devLoader.js'] : []),
  ],
  output: {
    ...(!isDevelopment
      ? {
          chunkFilename: 'assets/[chunkhash].js',
          filename: '[name].[contenthash].js',
        }
      : {}),
    path: path.resolve('public'),
  },
  module: {
    rules: [
      { test: /\.(jsx?)$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.(css|scss)$/, use: ['style-loader', 'css-loader'] },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.ts', '.jsx', '.json'],
    alias: {
      '/imports': path.resolve(__dirname, 'imports'),
      ...(isDevelopment ? { 'react-dom': '@hot-loader/react-dom' } : {}),
    },
  },
  plugins: [

    new HtmlWebpackPlugin(
      isDevelopment
        ? { template: '.dev-server-skeleton/main.html' }
        : { template: mainHtml, filename: `../${mainHtml}` }
    ),
  ],
  devtool: isDevelopment ? 'none' : 'source-map',
  externals: [ meteorExternals() ],
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve('.dev-server'),
    hot: true,
    port: 3000,
    proxy: {
      '/sockjs': meteor,
      '/sockjs-node': meteor,
      '/meteor/': {
        target: meteor,
        pathRewrite: { '^/meteor/': '' },
      },
    },
  },
});

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  return client({ isDevelopment });
};
