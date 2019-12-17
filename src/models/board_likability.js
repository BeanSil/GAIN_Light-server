export const Board_likability = (sequelize, DataTypes) => {
    return sequelize.define('board_likability',{
        
        board_id : {
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