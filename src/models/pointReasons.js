export const pointReasons = (sequelize, DataTypes) => {
    return sequelize.define('pointReasons', {
        reasion_id:{
            type:DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement:true
        },
        kind:{
            type:ENUM('상점','벌점'),
            allowNull:false
        },
        content:{
            type:DataTypes.String(100),
        }
    });
};