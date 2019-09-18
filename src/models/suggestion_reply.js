export const Suggestion_reply = (sequelize, DataTypes) => {
    return sequelize.define(suggestion_reply,{
        suggestion_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            auto_increment : true
        },
        user_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            auto_increment : true
        },
        content : {
            type : DataTypes.TEXT,
            allowNull : false
        },
        created_at : {
            type : DataTypes.DATETIME,
            default : now()
        }
    });
};