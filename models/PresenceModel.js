import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./UsersModel.js";

const {DataTypes} = Sequelize;

const Presence = db.define('Presence',{
    tgl_absen: DataTypes.DATEONLY,
    masuk: DataTypes.TIME,
    pulang: DataTypes.TIME,
    image: DataTypes.STRING,
    url: DataTypes.STRING,
    userId:{
        type: DataTypes.INTEGER,
        validate: {
            notEmpty: true
        }
    }
},{
    freezeTableName:true
});

User.hasMany(Presence);
Presence.belongsTo(User, {foreignKey: 'userId'});

export default Presence;    
