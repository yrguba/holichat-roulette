const path = require("path");

const Dotenv = require("dotenv-webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const webpack = require("webpack");

const getConfig = (mode = "production") => ({
  mode,
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: [/\.tsx?$/, /\.jsx?$/],
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              plugins: [
                [
                  "import",
                  { libraryName: "antd", libraryDirectory: "es" },
                  "antd",
                ],
                [
                  "import",
                  {
                    libraryName: "@ant-design/icons",
                    libraryDirectory: "lib/icons",
                    camel2DashComponentName: false,
                  },
                  "antd-icons",
                ],
              ],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.less|css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                modifyVars: {
                  "@primary-color": "#423361",
                  "@height-lg": "56px",
                  "@controlHeight": "56px",
                  "@select-single-item-height-lg": "56px",
                  "@select-multiple-item-height-lg": "56px",
                  "@select-height-lg": "56px",
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.png$/i,
        type: "asset/resource",
        generator: {
          filename: "[name][ext]",
          outputPath: "media",
          publicPath: "/media/",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "[name][ext]",
          outputPath: "media",
          publicPath: "/media/",
        },
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve(__dirname, "./src"),
      path.resolve(__dirname, "."),
      "node_modules",
    ],
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    // new webpack.DefinePlugin({
    //   "process.env": JSON.stringify(process.env),
    // }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ru|en-gb/),
    new Dotenv(),
    new CompressionPlugin(),
  ],
});

module.exports = (_, conf) => {
  const config = getConfig(conf.mode);

  if (conf.mode !== "production") {
    config.mode = "development";
    config.devtool = "eval-cheap-source-map";
    config.devServer = {
      static: ["build"],
      compress: true,
      port: 3000,
      hot: true,
      historyApiFallback: true,
      open: {
        app: {
          name: "Google Chrome",
        },
      },
    };
  } else {
    config.devtool = false;
    config.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          test: /\.js(\?.*)?$/i,
        }),
      ],
    };
  }

  return config;
};
