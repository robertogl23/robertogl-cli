#!/usr/bin/env node
const configFactory = require('../config/webpack.config');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const paths = require('../config/paths');
const fs = require("fs-extra");
const newPaths = require("../config/news-paths");
const isTempleteRun = require("../config/is-templete-run");

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
let compiler;

if (!fs.existsSync(paths.appRobConfig)) {
  const config = configFactory("development", false);
  compiler = webpack(config);
} else {
  const robConfig = require(paths.appRobConfig);
  const newConfig = newPaths(robConfig.pathsFiles,isTempleteRun());
  const config = configFactory("development", newConfig);
  compiler = webpack(config);
  
}

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
console.log(paths.appPublic);
const server = new WebpackDevServer(devServerOptions, compiler);

const runServer = async () => {
  console.log('Starting server...');
  await server.start();
};

runServer();