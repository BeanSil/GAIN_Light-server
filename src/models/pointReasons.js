export const PointReasons = (sequelize, DataTypes) => {
    return sequelize.define('pointReasons', {
        reasion_id:{
            type:DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement:true
        },
        kind:{
            type:DataTypes.ENUM('상점','벌점'),
            allowNull:false
        },
        content:{
            type:DataTypes.STRING(200)
        }
    });
};