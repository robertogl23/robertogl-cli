const pathsConfig = require("./paths");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const MyPlugin = require("../utils/hello-word-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const cssRegex = /\.css$/;
let paths = pathsConfig;

const swcOptions = {
  jsc: {
    parser: {
      syntax: "ecmascript",
      jsx: true,
    },
    transform: {
      react: {
        pragma: "React.createElement",
        pragmaFrag: "React.Fragment",
        throwIfNamespace: true,
        development: false,
        useBuiltins: false,
      },
    },
  },
};

module.exports = function (webpackEnv, robConfig) {
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";
  if (!robConfig) {
    return {
      mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
      devtool: isEnvProduction ? false : "cheap-module-source-map",
      entry: paths.appIndexJs,
      output: {
        path: paths.appBuild,
        pathinfo: isEnvDevelopment,
        publicPath: "",
        filename: isEnvProduction
          ? "[name].[contenthash:8].js"
          : isEnvDevelopment && "[name].js",
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules)/,
            use: {
              loader: "swc-loader",
              options: swcOptions,
            },
          },
        ],
      },
    };
  }
  paths = Object.assign(paths, robConfig);
  return {
    mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
    devtool: isEnvProduction ? false : "cheap-module-source-map",
    entry: paths.appIndexJs,
    output: {
      path: paths.appBuild,
      pathinfo: isEnvDevelopment,
      publicPath: "",
      filename: isEnvProduction
        ? "static/js/[name].[contenthash:8].js"
        : isEnvDevelopment && "static/js/[name].js",
    },
    optimization: {
      minimize: isEnvProduction,
      concatenateModules: true,
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
        }),
        // This is only used in production mode
        new CssMinimizerPlugin(),
      ],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules)/,
          use: {
            // `.swcrc` can be used to configure swc
            loader: "swc-loader",
            options: swcOptions,
          },
        },
        {
          test: cssRegex,
          use: [
            isEnvDevelopment
              ? "style-loader"
              : { loader: MiniCssExtractPlugin.loader },
            "css-loader",
          ],
        },
        {
          type: "asset",
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: paths.appHtml,
          },
          isEnvProduction
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined
        )
      ),
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:8].css",
        chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
      }),
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
      }),
      new WebpackManifestPlugin({
        fileName: "asset-manifest.json",
        publicPath: paths.publicUrlOrPath,
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);
          const entrypointFiles = entrypoints.main.filter(
            (fileName) => !fileName.endsWith(".map")
          );

          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          };
        },
      }),
      new MyPlugin({ options: '' })
    ],
  };
};
