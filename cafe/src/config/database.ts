
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "sqlite", // ✅ troca de "mysql" para "sqlite"
  database: "database.sqlite", // ✅ nome do arquivo SQLite
  synchronize: true,
  logging: false,
  entities: ["src/models/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: [],
});