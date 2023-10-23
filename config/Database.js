import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize('mysql://root:SiF2Zc6QvOF9NDekc6IE@containers-us-west-48.railway.app:6539/railway',{
    // username: process.env.DB_USERNAME,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,
    // host: process.env.DB_HOST,
    dialect: 'mysql',
});

export default db;