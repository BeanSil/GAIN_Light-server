export const Student = (sequelize, DataTypes) => {
    return sequelize.define('student', {
        user_id : {
            type : DataTypes.INTEGER,
            primaryKey : true
        },
        name : {
            type : DataTypes.STRING(20),
            allowNull : false
        },
        grade : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        class : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        number : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        phone : {
            type : DataTypes.STRING(11),
            allowNull : false,
            unique : true
        },
        point : {
            type : DataTypes.INTEGER,
            allowNull : false,
            defaultValue : 0
        }
    });
};