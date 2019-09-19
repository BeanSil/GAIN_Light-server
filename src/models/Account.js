export const Account = (sequelize, DataTypes) => {
    return sequelize.define('account', {
        user_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        id : {
            type : DataTypes.STRING(20),
            allowNull : false,
            unique : true
        },
        password : {
            type : DataTypes.STRING,
            allowNull : false
        },
        auth : {
            type : DataTypes.ENUM('학생', '선생님', '게스트'),
            allowNull : false
        },
        email : {
            type : DataTypes.STRING,
            allowNull : false
        },
        is_valid : {
            type : DataTypes.BOOLEAN,
            defaultValue : false
        }
    });
};