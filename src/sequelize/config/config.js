import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    dialect: 'postgres',
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    seederStorage: process.env.DB_SEEDER_STORAGE,
    seederStorageTableName: process.env.DB_SEEDER_STORAGE_TABLE,
    migrationStorageTableName: process.env.DB_MIGRATION_STORAGE_TABLE,
  },
  test: {
    dialect: 'postgres',
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    seederStorage: process.env.DB_SEEDER_STORAGE,
    seederStorageTableName: process.env.DB_SEEDER_STORAGE_TABLE,
    migrationStorageTableName: process.env.DB_MIGRATION_STORAGE_TABLE,
  },
  production: {
    dialect: 'postgres',
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    seederStorage: process.env.DB_SEEDER_STORAGE,
    seederStorageTableName: process.env.DB_SEEDER_STORAGE_TABLE,
    migrationStorageTableName: process.env.DB_MIGRATION_STORAGE_TABLE,
  },
};
