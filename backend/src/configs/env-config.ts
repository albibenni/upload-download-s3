import dotenv, { configDotenv } from "dotenv";
import path, { resolve } from "path";

function setupEnv() {
  const basePath = __dirname;
  switch (process.env.NODE_ENV) {
    case "prod":
      console.log("Environment is 'prod'");
      configDotenv({
        path: resolve(basePath, "../.env.prod"),
      });
      break;
    case "dev":
      console.log("Environment is 'development'");
      configDotenv({
        path: resolve(basePath, "../.env.dev"),
      });
      break;
    case "local":
      console.log("Environment is 'local'");
      dotenv.config({
        path: path.resolve(process.env.PWD!, ".env.local"),
      });
      break;
    default:
      console.log("Environment is 'default'");
      dotenv.config({
        path: path.resolve(process.env.PWD!, ".env.local"),
      });
  }
}
setupEnv();

const config = {
  db: {
    user: process.env.POSTGRES_USER ?? "",
    password: process.env.POSTGRES_PASSWORD ?? "password",
    host: process.env.POSTGRES_HOST ?? "localhost",
    port: parseInt(process.env.POSTGRES_PORT ?? "5432"),
    database: process.env.POSTGRES_DB ?? "",
    url:
      process.env.DB_URL ??
      "postgresql://albibenni:password@localhost:5432/albibenni",
  },
  minio: {
    root_user: process.env.MINIO_ROOT_USER ?? "admin",
    root_password: process.env.MINIO_ROOT_PASSWORD ?? "password",
    port: parseInt(process.env.MINIO_PORT ?? "9000"),
    admin_port: parseInt(process.env.MINIO_ADMIN_PORT ?? "9000"),
  },
  aws: {
    endpoint: process.env.ENDPOINT ?? "",
    bucket: process.env.S3_BUCKET ?? "",
    region: process.env.REGION ?? "",
    access_key: process.env.ACCESS_KEY ?? "",
    secret_key: process.env.SECRET_ACCESS_KEY ?? "",
    ssl: process.env.SSL ?? false,
    force_path_style: process.env.FORCE_STYLE ?? false,
  },
};
export default config;
