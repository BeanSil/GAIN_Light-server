export const Points = (sequelize, DataTypes) => {
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
            type:DataTypes.INTEGER,
            allowNull:false
        },
        amount:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        reason_id:{
            type:DataTypes.ENUM('상점','벌점'),
            primaryKey:true
        },
        detail:{
            type:DataTypes.STRING,
        },
        created_at:{
            type:DataTypes.DATE,
            default:DataTypes.NOW
        }
    });
};