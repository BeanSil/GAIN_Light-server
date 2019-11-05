export const Req_song = (sequelize, DataTypes) => {
    return sequelize.define('req_song', {
        rs_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            allowNull : false,
            autoIncrement : true
        },
        title : {
            type : DataTypes.STRING,
            allowNull : false
        },
        artist : {
            type : DataTypes.STRING,
            allowNull : false
        },
        url : {
            type : DataTypes.STRING,
            allowNull : false
        },
        user_id : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        created_at : {
            type : DataTypes.DATEONLY,
            defaultValue : DataTypes.NOW
        },
        status : {
            type : DataTypes.ENUM("대기","승인","거절","완료"),
            defaultValue : "대기"
        }
   });
};