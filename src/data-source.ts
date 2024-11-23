import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();


export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'], // Your entity paths
  migrations: ['src/migration/*.ts'],
  synchronize: true, // Auto-sync entities with DB (disable in production)
  logging: false,
  extra: {
    encrypt: true,
    trustServerCertificate: false,
    connectionTimeout: 30000,
  },
});



//Local DB
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
//   logging: true,
//   extra: {
//     encrypt: false,
//     trustServerCertificate: true,
//     encrypt: false,
//     trustServerCertificate: true,
//     connectionTimeout: 30000,
//   },
// });


// const local_manu_config:TypeOrmModuleOptions = {
//   type: 'mssql',          // Database type
//   host: 'localhost',      // Your MS SQL Server host
//   port: 1434,             // Port for Manu local server
//   username: 'developer', 
//   password: '12345678',
//   database: 'dbProject',
//   entities: [__dirname + '/**/*.entity{.ts,.js}'],  // Path to your entities
//   synchronize: true,      // Auto-sync entities with DB (disable in production)
//   logging: false,
//   extra: {
//     encrypt: false,
//     trustServerCertificate: true,  // Required for development environments with self-signed certificates
//   },
// }  
