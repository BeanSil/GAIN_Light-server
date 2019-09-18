export const Guest = (sequelize, DataTypes) => {
    return sequelize.define('guest', {
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
        },
        expiry_date : {
            type : DataTypes.DATE,
            allowNull : false
        }
    });
};