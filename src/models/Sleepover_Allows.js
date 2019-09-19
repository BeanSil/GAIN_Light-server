export const Sleepover_Allows = (sequelize, DataTypes) => {
  return sequelize.define('sleepover_allow', {
    user_id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement : true
    },
    place : {
      type : DataTypes.STRING
    }
  });
};