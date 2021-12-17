#!/usr/bin/env node


const configFactory = require('../config/webpack.config');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const paths = require('../config/paths');

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const config = configFactory('development');
const compiler = webpack(config);

const devServerOptions = {
  // open: true,
  hot: true,
  port: DEFAULT_PORT,
  // Enable gzip compression of generated files.
  compress: true,
  static: {
    directory: paths.appPublic,
    publicPath: [paths.publicUrlOrPath],
  },
  historyApiFallback: true,
};

const server = new WebpackDevServer(devServerOptions, compiler);

const runServer = async () => {
  console.log('Starting server...');
  await server.start();
};

runServer();