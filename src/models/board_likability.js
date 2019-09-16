export const board_data = (sequelize, DataTypes) => {
    return sequelize.define('board_data',{
        
        board_id : {
            type : DataTypes.INTEGER(5)
        },
        user_id : {
            type : DataTypes.INTEGER(30)   
        },
        likability : {
            type : DataTypes.ENUM("좋아요","싫어요")
        }
    })
}