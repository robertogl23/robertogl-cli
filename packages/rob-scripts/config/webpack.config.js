"use strict";
const fs = require("fs");
const path = require("path");
const pathsConfig = require("./paths");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin").default;
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const MyPlugin = require("../utils/hello-word-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const getCSSModuleLocalIdent = require("../utils/getCSSModuleLocalIdent");

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;

let paths = pathsConfig;

const swcOptions = {
  jsc: {
    parser: {
      syntax: "ecmascript",
      jsx: true,
    },
    transform: {
      react: {
        runtime: "automatic",
        pragma: "React.createElement",
        pragmaFrag: "React.Fragment",
        throwIfNamespace: true,
        development: false,
        useBuiltins: false,
      },
      optimizer: {
        globals: {
          vars: {
            __DEBUG__: "true",
          },
        },
      },
    },
  },
};

const swcTSOptions = {
  jsc: {
    parser: {
      syntax: "typescript",
      tsx: true,
      decorators: true,
      dynamicImport: true,
    },
    transform: {
      legacyDecorator: true,
      decoratorMetadata: true,
      react: {
        runtime: "automatic",
        pragma: "React.createElement",
        pragmaFrag: "React.Fragment",
        throwIfNamespace: true,
        development: false,
        useBuiltins: false,
      },
      optimizer: {
        globals: {
          vars: {
            __DEBUG__: "true",
          },
        },
      },
    },
  },
};

module.exports = function (webpackEnv, robConfig) {
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";

  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isEnvDevelopment && require.resolve("style-loader"),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        // css is located in `static/css`, use '../../' to locate index.html folder
        // in production `paths.publicUrlOrPath` can be a relative path
        options: paths.publicUrlOrPath.startsWith(".")
          ? { publicPath: "../../" }
          : {},
      },
      {
        loader: require.resolve("css-loader"),
        options: cssOptions,
      },
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve("postcss-loader"),
        options: {
          postcssOptions: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            ident: "postcss",
            config: false,
            plugins: [
              "postcss-flexbugs-fixes",
              [
                "postcss-preset-env",
                {
                  autoprefixer: {
                    flexbox: "no-2009",
                  },
                  stage: 3,
                },
              ],
              // Adds PostCSS Normalize as the reset css with default options,
              // so that it honors browserslist config in package.json
              // which in turn let's users customize the target behavior as per their needs.
              "postcss-normalize",
            ],
          },
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        },
      },
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve("resolve-url-loader"),
          options: {
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            root: paths.appSrc,
          },
        },
        {
          loader: require.resolve(preProcessor),
          options: {
            sourceMap: true,
          },
        }
      );
    }
    return loaders;
  };

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
      publicPath: paths.publicUrlOrPath,
      filename: isEnvProduction
        ? "static/js/[name].[contenthash:8].js"
        : isEnvDevelopment && "static/js/[name].js",
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: isEnvProduction
        ? "static/js/[name].[contenthash:8].chunk.js"
        : isEnvDevelopment && "static/js/[name].chunk.js",
      assetModuleFilename: "static/media/[name].[hash][ext]",
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
            loader: "swc-loader",
            options: swcOptions,
          },
        },
        {
          test: /\.(ts|tsx)$/,
          exclude: /(node_modules)/,
          use: {
            loader: "swc-loader",
            options: swcTSOptions,
          },
        },

        {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: getStyleLoaders({
            importLoaders: 1,
            sourceMap: true,
            modules: {
              mode: "icss",
            },
          }),
          sideEffects: true,
        },
        {
          test: cssModuleRegex,
          use: getStyleLoaders({
            importLoaders: 1,
            sourceMap: true,
            modules: {
              mode: "local",
              getLocalIdent: getCSSModuleLocalIdent,
            },
          }),
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
      !isEnvDevelopment &&
        new MiniCssExtractPlugin({
          filename: "static/css/[name].[contenthash:8].css",
          chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
        }),
      isEnvProduction &&
        new WorkboxPlugin.GenerateSW({
          clientsClaim: true,
          skipWaiting: true,
        }),
      isEnvProduction && new MyPlugin({ options: "" }),
    ].filter(Boolean),
  };
};
