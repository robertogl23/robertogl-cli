const path = require("path");
const fs = require("fs");
const newPaths = require("../packages/rob-scripts/config/news-paths");
const { resolveApp } = require("../packages/rob-scripts/config/reselve-app-path");
const appDirectory = fs.realpathSync(process.cwd());

const testConfig = {
  pathsFiles: {
    appIndexJs: "main.js",
    appHtml: "public/putas.html",
  },
};

const indexJs = path.resolve(
  appDirectory,
  `packages/template/${testConfig.pathsFiles.appIndexJs}`
);
test("Validar rutas del appIndexJs", () => {
  expect(newPaths(testConfig.pathsFiles,true).appIndexJs).toBe(indexJs);
});

test("Validar ruta de appHtml", () => {
  const html = path.resolve(
    appDirectory,
    `packages/template/${testConfig.pathsFiles.appHtml}`
  );
  expect(newPaths(testConfig.pathsFiles,true).appHtml).toBe(html);
});
