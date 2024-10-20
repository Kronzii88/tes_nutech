"use strict";

const dotenv = require("dotenv");
dotenv.config();

let environments = {};

//config Database

environments.development = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: process?.env?.DATABASE_HOST,
    user: process?.env?.DATABASE_USERNAME,
    password: process?.env?.DATABASE_PASSWORD,
    database: process?.env?.DATABASE_NAME || null,
    port: process?.env?.DATABASE_PORT,
    multipleStatements: false,
    // charset: 'utf8mb4',
    //timezone: '+07:00',
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  },
  listPerPage: process.env.LIST_PER_PAGE || 10,
  curr_env: "DEVELOPMENT",
};

environments.production = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: process?.env?.DB_PROD_HOST,
    user: process?.env?.DB_PROD_USERNAME,
    password: process?.env?.DB_PROD_PASSWORD,
    database: process?.env?.DB_PROD_NAME || null,
    port: process?.env?.DB_PROD_PORT,
    multipleStatements: false,
    // charset: 'utf8mb4',
    // timezone: '+07:00'
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  },
  listPerPage: process.env.LIST_PER_PAGE || 10,
  curr_env: "PRODUCTION",
};

environments.staging = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: process?.env?.DB_STAG_HOST,
    user: process?.env?.DB_STAG_USERNAME,
    password: process?.env?.DB_STAG_PASSWORD,
    database: process?.env?.DB_STAG_NAME || null,
    port: process?.env?.DB_STAG_PORT,
    multipleStatements: false,
    // charset: 'utf8mb4',
    // timezone: '+07:00'
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  },
  listPerPage: process.env.LIST_PER_PAGE || 10,
  curr_env: "STAGING",
};

const currentEnvironment =
  typeof process.env.NODE_ENV == "string" ? process.env.NODE_ENV : "";

const environmentToExport =
  typeof environments[currentEnvironment] == "object"
    ? environments[currentEnvironment]
    : environments.test;

module.exports = environmentToExport;
