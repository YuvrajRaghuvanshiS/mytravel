import Dotenv from "dotenv-webpack";

export default {
  plugins: [
    new Dotenv({
      path: ".env", // optional
    }),
  ],
};
