const { resolveOwn, resolveApp } = require("./reselve-app-path");

module.exports = (config, isTempleteRun) => {
  const newConfig = config;
  const entries = Object.entries(newConfig);

  entries.forEach(([key, value]) => { 
    if (isTempleteRun) {
      const templatePath = "../template";
      newConfig[key] = resolveOwn(`${templatePath}/${value}`);
      return;
    }
    newConfig[key] = resolveApp(`${value}`);
  });

  return newConfig;
};
