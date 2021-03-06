const { resolveApp,resolveOwn} = require("./reselve-app-path");
const isTempleteRun = require("./is-templete-run");

const buildPath = process.env.BUILD_PATH || "build";
console.log(process.env.NODE_ENV)
const publicUrlOrPath = "";
module.exports = {
  appPath: resolveApp("."),
  appBuild: resolveApp(buildPath),
  appPublic: resolveApp("public"),
  appHtml: resolveApp("public/index.html"),
  appIndexJs: resolveApp("src/index.js"),
  appSrc: resolveApp("src"),
  appRobConfig: resolveApp("robconfig.json"),
  appPackageJson: resolveApp("package.json"),
  publicUrlOrPath
};

if (
  isTempleteRun()
) {
  const templatePath = "../template";
  module.exports = {
    appPath: resolveApp("."),
    appBuild: resolveOwn(`${templatePath}/build`),
    appPublic: resolveOwn(`${templatePath}/public`),
    appHtml: resolveOwn(`${templatePath}/public/index.html`),
    appIndexJs: resolveOwn(`${templatePath}/index.js`),
    // appIndexJs: resolveOwn(`${templatePath}/src/index.js`),
    appPackageJson: resolveOwn(`${templatePath}/package.json`),
    appSrc: resolveOwn(`${templatePath}/src`),
    appRobConfig: resolveOwn(`${templatePath}/robconfig.json`),
    publicUrlOrPath
  };
}
