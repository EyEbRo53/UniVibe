import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();


// export const AppDataSource = new DataSource({
//   type: 'mssql',
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   entities: [__dirname + '/**/*.entity{.ts,.js}'], // Your entity paths
//   migrations: ['src/migration/*.ts'],
//   synchronize: true, // Auto-sync entities with DB (disable in production)
//   logging: false,
//   extra: {
//     encrypt: true,
//     trustServerCertificate: false,
//     connectionTimeout: 30000,
//   },
// });

//local connection
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: ['src/migration/*.ts'],
  synchronize: true,
  logging: true,
});