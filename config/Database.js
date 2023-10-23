import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize(process.env.MYSQL_URL, {
    dialect: 'mysql',
  });

export default db;