// Update with your config settings.
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "migrations"),
    },
  },
};
