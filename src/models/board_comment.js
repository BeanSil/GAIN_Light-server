export const Board_comment = (sequelize, DataTypes) => {
    return sequelize.define('board_comment',{
        comment_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        board_id : {
            type : DataTypes.INTEGER
        },
        user_id : {
            type : DataTypes.INTEGER
        },
        parent_id : {
            type : DataTypes.INTEGER
        },
        content : {
            type : DataTypes.TEXT,
            allowNull : false
        },
        created_at : {
            type : DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at : {
            type : DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });
};