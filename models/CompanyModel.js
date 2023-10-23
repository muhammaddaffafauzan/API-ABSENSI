import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Company = db.define('Company',{
    nama: DataTypes.STRING,
    alamat: DataTypes.TEXT,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    jam_buka: DataTypes.TIME,
    jam_tutup: DataTypes.TIME,
    status:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
},{
    freezeTableName: true
});


export default Company;