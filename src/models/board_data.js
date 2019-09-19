export const Board_data = (sequelize, DataTypes) => {
    return sequelize.define('board_data',{
        data_id : {
            type : DataTypes.INTEGER(5),
            primaryKey : true,
            auto_increment : true
        },
        board_id : {
            type : DataTypes.INTEGER(5)
        },
        upload_url : {
            type : DataTypes.VARCHAR,
            allowNull : false
        }
    });
};