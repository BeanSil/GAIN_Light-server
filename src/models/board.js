export const Board = (sequelize, DataTypes) => {
    return sequelize.define('board',{
        board_id : {
            type : DataTypes.INTEGER(5),
            primaryKey : true,
            auto_increment : true
        },
        user_id : {
            type : DataTypes.INTEGER(30)   
        },
        kind : {
            type : DataTypes.ENUM("공지사항","자료실","일반게시판"),
            default : 3
        },
        title : {
            type : DataTypes.VARCHAR,
            allowNull : false
        },
        content : {
            type : DataTypes.TEXT,
            allowNull : false
        },
        is_anonymous : {
            type : DataTypes.BOOLEAN,
            default : false
        },
        created_at : {
            type : DataTypes.DATETIME,
            default : now()
        },
        updated_at : {
            type : DataTypes.DATETIME,
            default : now()
        },
    })
}