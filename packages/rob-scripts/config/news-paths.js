const { resolveOwn, resolveApp } = require("./reselve-app-path");

module.exports = (config, isTempleteRun) => {
  const newConfig = config;
  const configKeys = Object.keys(newConfig);
  const configValues = Object.values(newConfig);
  console.log(resolveApp(`${configValues[0]}`));
  configKeys.forEach((key, i) => {
    if (isTempleteRun) {
      const templatePath = "../template";
      newConfig[key] = resolveOwn(`${templatePath}/${configValues[i]}`);
      return;
    }
    console.log("Paths mode is not templete run");
    newConfig[key] = resolveApp(`${configValues[i]}`);
  });
  return newConfig;
};
