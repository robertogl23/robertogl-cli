// If your plugin is direct dependent to the html webpack plugin:
const HtmlWebpackPlugin = require("html-webpack-plugin");
// If your plugin is using html-webpack-plugin as an optional dependency
// you can use https://github.com/tallesl/node-safe-require instead:
// const HtmlWebpackPlugin = require("safe-require")("html-webpack-plugin");

class MyPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("MyPlugin", (compilation) => {
      console.log("The compiler is starting a new compilation...");

      // Static Plugin interface |compilation |HOOK NAME | register listener
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        "MyPlugin", // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          // Manipulate the content
            data.html += `<script id="service-worker">
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
          }</script>`;
          // Tell webpack to move on
          cb(null, data);
        }
      );
    });
  }
}

module.exports = MyPlugin;
