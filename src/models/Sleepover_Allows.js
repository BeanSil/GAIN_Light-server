export const Sleepover_Allows = (sequelize, DataTypes) => {
  return sequelize.define('Sleepover_Allows', {
    user_id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      allowNull : false
    },
    place : {
      type : DataTypes.STRING.BINARY
    }
  });
};