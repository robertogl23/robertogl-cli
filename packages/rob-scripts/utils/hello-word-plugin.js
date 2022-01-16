const HtmlWebpackPlugin = require("html-webpack-plugin");

class MyPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("MyPlugin", (compilation) => {
      console.log("The compiler is starting a new compilation...");
      const hooks = HtmlWebpackPlugin.getHooks(compilation);

      hooks.alterAssetTagGroups.tap("MyPlugin", (assets) => {
        console.log("The html-webpack-plugin is inserting a new script tag...");
        assets.bodyTags.push({
          tagName: "script",
          innerHTML: `
          if ("serviceWorker" in navigator) {
            window.addEventListener("load", () => {
              navigator.serviceWorker
                .register("/service-worker.js")
                .then((registration) => {
                  console.log("SW registered: ", registration);
                })
                .catch((registrationError) => {
                  console.log("SW registration failed: ", registrationError);
                });
            });
          }`,
          closeTag: true,
          attributes: {
            id: "service-worker-script",
          },
        });
      });
    });
  }
}

module.exports = MyPlugin;
