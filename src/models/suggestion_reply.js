export const board_com_likability = (sequelize, DataTypes) => {
    return sequelize.define(board_com_likability,{
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
    })
}