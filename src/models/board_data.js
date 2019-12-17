export const Board_data = (sequelize, DataTypes) => {
    return sequelize.define('board_data',{
        data_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        board_id : {
            type : DataTypes.INTEGER
        },
        upload_url : {
            type : DataTypes.STRING,
            allowNull : false
        }
    });
};