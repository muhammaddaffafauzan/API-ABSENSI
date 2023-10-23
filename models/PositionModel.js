import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Position = db.define('Position',{
   jabatan: DataTypes.STRING
},{
    freezeTableName:true
});

export default Position;    
