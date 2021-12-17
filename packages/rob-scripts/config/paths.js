const path = require("path");
const fs = require("fs");
const appDirectory = fs.realpathSync(process.cwd());

const buildPath = process.env.BUILD_PATH || "build";

const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const resolveOwn = (relativePath) =>
  path.resolve(__dirname, "..", relativePath);

const files =
  fs.existsSync(resolveApp("public/index.html")) ||
  fs.existsSync(resolveApp("src/index.js"));

module.exports = {
  appPath: resolveApp("."),
  appBuild: resolveApp(buildPath),
  appPublic: resolveApp("public"),
  appHtml: resolveApp("public/index.html"),
  appIndexJs: resolveApp("src/index.js"),
  appSrc: resolveApp("src"),
  appRobConfig: resolveApp("rob.config.json"),
  publicUrlOrPath: "",
};

if (!files) {
  module.exports = {
    appIndexJs: resolveApp("index.js"),
  };
}

const ownPackageJson = require("../package.json");
const robScriptsPath = resolveApp(`node_modules/${ownPackageJson.name}`);
const robScriptsLinked =
  fs.existsSync(robScriptsPath) &&
  fs.lstatSync(robScriptsPath).isSymbolicLink();

if (
  !robScriptsLinked &&
  __dirname.indexOf(path.join("packages", "rob-scripts", "config")) !== -1
) {
  const templatePath = "../template";
  const files =
    fs.existsSync(resolveOwn("public/index.html")) ||
    fs.existsSync(resolveOwn("src/index.js"));

  module.exports = {
    appPath: resolveApp("."),
    appBuild: resolveOwn(`${templatePath}/build`),
    appPublic: resolveOwn(`${templatePath}/public`),
    appHtml: resolveOwn(`${templatePath}/public/index.html`),
    appIndexJs: resolveOwn(`${templatePath}/src/index.js`),
    appSrc: resolveOwn("src"),
    appRobConfig: resolveOwn(`${templatePath}/rob.config.json`),
    publicUrlOrPath: "",
  };

  if (!files) {
    console.log('entra aqui')
    module.exports = {
      appIndexJs: resolveOwn(`${templatePath}/index.js`),
    };
  }
}
