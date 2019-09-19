export const points = (sequelize, DataTypes) => {
    return sequelize.define('points', {
        point_id:{
            type: DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement:true,
            allowNull: false    
        },
        giver_id:{
            type:DataTypes.INTEGER
        },
        receiver_id:{
            type:DataTypes.INTEGER
        },
        kind:{
            type:ENUM('상점','벌점'),
            allowNull:false
        },
        amount:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        reason_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true
        },
        detail:{
            type:DataTypes.STRING(100),
        },
        created_at:{
            type:DataTypes.DATE,
            default:DataTypes.NOW
        }
    });
};