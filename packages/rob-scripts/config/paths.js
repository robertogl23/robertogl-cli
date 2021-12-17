const path = require("path");
const fs = require("fs");
const appDirectory = fs.realpathSync(process.cwd());

const buildPath = process.env.BUILD_PATH || "build";

const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

module.exports = {
  appPath: resolveApp("."),
  appBuild: resolveApp(buildPath),
  appPublic: resolveApp("public"),
  appHtml: resolveApp("public/index.html"),
  appIndexJs: resolveApp("src/index.js"),
  appSrc: resolveApp("src"),
  publicUrlOrPath:''
};

const ownPackageJson = require("../package.json");
const robScriptsPath = resolveApp(`node_modules/${ownPackageJson.name}`);
const robScriptsLinked =
  fs.existsSync(robScriptsPath) &&
  fs.lstatSync(robScriptsPath).isSymbolicLink();

if (
  !robScriptsLinked &&
  __dirname.indexOf(path.join('packages','rob-scripts', 'config')) !== -1
) {
  module.exports = {
    appPath: resolveApp("."),
    appBuild: resolveApp(`../${buildPath}`),
    appPublic: resolveApp("../public"),
    appHtml: resolveApp("../public/index.html"),
    appIndexJs: resolveApp("../src/index.js"),
    appSrc: resolveApp("src"),
    publicUrlOrPath:''
  };
}


