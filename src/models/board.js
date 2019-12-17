export const Board = (sequelize, DataTypes) => {
    return sequelize.define('board', {
        board_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        user_id : {
            type : DataTypes.INTEGER
        },
        kind : {
            type : DataTypes.ENUM("공지사항","자료실","일반게시판"),
            default : 3
        },
        title : {
            type : DataTypes.STRING(255),
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
        createdAt : {
            type: DataTypes.DATE,
            allowNull: false, 
            defaultValue: DataTypes.NOW
        },
        updatedAt : {
            type: DataTypes.DATE,
            allowNull: false, 
            defaultValue: DataTypes.NOW
        }
    });
};