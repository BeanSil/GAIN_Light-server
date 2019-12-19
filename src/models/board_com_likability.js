export const Board_com_likability = (sequelize, DataTypes) => {
    return sequelize.define('board_com_likability',{
        comment_id : {
            type : DataTypes.INTEGER
        },
        user_id : {
            type : DataTypes.INTEGER
        },
        likability : {
            type : DataTypes.ENUM("좋아요","싫어요")
        }
    });
};