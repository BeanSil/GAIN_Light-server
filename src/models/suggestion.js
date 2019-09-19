export const Suggestion = (sequelize, DataTypes) => {
    return sequelize.define(suggestion,{
        suggestion_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            auto_increment : true
        },
        user_id : {
            type : DataTypes.INTEGER
        },
        title : {
            type : DataTypes.VARCAHR,
            allowNull : false
        },
        kind : {
            type : DataTypes.ENUM("급식","동아리","시설","기숙사","잔류","규칙"),
            allowNull : false
        },
        content : {
            type : DataTypes.TEXT,
            allowNull : false
        },
        is_replied : {
            type : DataTypes.BOOLEAN,
            default : false
        },
        created_at : {
            type : DataTypes.DATETIME,
            default : now()
        }
    });
};