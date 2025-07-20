import { sequelize } from "../lib/db";
import {DataTypes} from 'sequelize'


export const User = sequelize.define('User', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type:DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type:DataTypes.STRING,
        allowNull: false
    },
    imageProfileURL: {
        type: DataTypes.STRING,
        allowNull: true
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false
    }    
})