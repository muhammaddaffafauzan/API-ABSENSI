import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize('mysql://root:SiF2Zc6QvOF9NDekc6IE@containers-us-west-48.railway.app:6539/railway');

export default db;