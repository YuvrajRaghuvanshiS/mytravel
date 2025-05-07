import Dotenv from "dotenv-webpack";

const webpackConfig = {
  // other config...
  plugins: [
    new Dotenv({
      path: "./.env", // optional
    }),
  ],
};

export default webpackConfig;
