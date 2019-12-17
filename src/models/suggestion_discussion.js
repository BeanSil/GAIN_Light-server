export const Suggestion_discussion = (sequelize, DataTypes) => {
    return sequelize.define(suggestion_discussion,{
        discussion_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            auto_increment : true
        },
        suggestion_id : {
            type : DataTypes.INTEGER
        },
        user_id : {
            type : DataTypes.INTEGER
        },
        opinion : {
            type : DataTypes.ENUM("찬성","반대"),
            allowNull : false
        },
        view : {
            type : DataTypes.TEXT
        },
        created_at : {
            type : DataTypes.DATETIME,
            default : now()
        }
    });
};