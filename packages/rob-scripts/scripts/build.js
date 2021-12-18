#!/usr/bin/env node
const webpack = require("webpack");
const fs = require("fs-extra");
const chalk = require("chalk");
const configFactory = require("../config/webpack.config");
const paths = require("../config/paths");
const { resolveOwn, resolveApp } = require("../config/reselve-app-path");
const newPaths = require("../config/news-paths");
// Generate configuration

function build(webpackConfig) {
  const compiler = webpack(webpackConfig);
  compiler.run((err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }
    const info = stats.toJson();
    if (stats.hasErrors()) {
      console.error(info.errors);
    }
    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }
    if (!stats.hasErrors()) {
      console.log(stats.toString({ colors: true }));
      console.log(chalk.blue("Build complete."));
      console.log(chalk.blue(stats.compilation.outputOptions.path));
      console.log(chalk.blue(stats.compilation.outputOptions.scriptType));
    }
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: (file) => file !== paths.appHtml,
  });
}
if (!fs.existsSync(paths.appRobConfig)) {
  const config = configFactory("production", false);
  build(config);
  return;
}
const robConfig = require(paths.appRobConfig);
const newConfig = newPaths(robConfig.pathsFiles);
const config = configFactory("production", newConfig);
fs.emptyDirSync(paths.appBuild);
if(fs.existsSync(paths.appPublic)){
  copyPublicFolder();
}
build(config);
