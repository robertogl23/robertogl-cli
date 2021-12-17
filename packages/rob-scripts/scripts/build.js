#!/usr/bin/env node
const webpack = require("webpack");
const fs = require("fs-extra");

const configFactory = require("../config/webpack.config");
const paths = require("../config/paths");

// Generate configuration
const config = configFactory("production");

function build() {
  const compiler = webpack(config);
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
      console.log("Build OK");
    }
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}


fs.emptyDirSync(paths.appBuild);
copyPublicFolder();
build();
