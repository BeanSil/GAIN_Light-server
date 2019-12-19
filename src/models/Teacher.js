export const Teacher = (sequelize, DataTypes) => {
    return sequelize.define('teacher', {
        user_id : {
            type : DataTypes.INTEGER,
            primaryKey : true
        },
        name : {
            type : DataTypes.STRING(50),
            allowNull : false
        },
        phone : {
            type : DataTypes.STRING(11),
            allowNull : false,
            unique : true
        }
    });
};