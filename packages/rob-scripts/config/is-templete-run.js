const path = require("path");
const fs = require("fs");
const {resolveApp} = require("./reselve-app-path")
const ownPackageJson = require("../package.json");

const robScriptsPath = resolveApp(`node_modules/${ownPackageJson.name}`);

const robScriptsLinked =
  fs.existsSync(robScriptsPath) &&
  fs.lstatSync(robScriptsPath).isSymbolicLink();

module.exports = () => !robScriptsLinked &&
__dirname.indexOf(path.join("packages", "rob-scripts", "config")) !== -1 