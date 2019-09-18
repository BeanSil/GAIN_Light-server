export const Board_comment = (sequelize, DataTypes) => {
    return sequelize.define('board_comment',{
        comment_id : {
            type : DataTypes.INTEGER(5),
            primaryKey : true,
            auto_increment : true
        },
        board_id : {
            type : DataTypes.INTEGER(5)
        },
        user_id : {
            type : DataTypes.INTEGER(30)   
        },
        parent_id : {
            type : DataTypes.INTEGER(30),
            default : Null
        },
        content : {
            type : DataTypes.TEXT,
            allowNull : false
        },
        created_at : {
            type : DataTypes.DATETIME,
            default : now()
        },
        updated_at : {
            type : DataTypes.DATETIME,
            default : now()
        }
    });
};