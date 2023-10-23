import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./UsersModel.js";

const {DataTypes} = Sequelize;

const Employee = db.define('Employee',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    nip: DataTypes.INTEGER,
    nama: DataTypes.STRING,
    tmp_tgl_lahir: DataTypes.STRING,
    jenis_kelamin: DataTypes.STRING,
    agama: DataTypes.STRING,
    alamat: DataTypes.TEXT,
    no_hp: DataTypes.INTEGER,
    jabatan: DataTypes.STRING,
    image: DataTypes.STRING,
    url: DataTypes.STRING,
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
},{
    freezeTableName:true
});

User.hasMany(Employee);
Employee.belongsTo(User, {foreignKey: 'userId'})

export default Employee;    
