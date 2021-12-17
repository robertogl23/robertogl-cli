const isTempleteRun = require("./is-templete-run");
const paths = require("./paths");
const { resolveOwn, resolveApp } = require("./reselve-app-path");

module.exports = (config) => {
    const configKeys = Object.keys(config);
    const configValues = Object.values(config);
    
    configKeys.forEach((key,i) => {
      if(isTempleteRun()){
        const templatePath = "../template";
        config[key] = resolveOwn(`${templatePath}/${configValues[i]}`);
        return
      }
      config[key] = resolveApp(configValues[i]);
    
    })
    return config;
}