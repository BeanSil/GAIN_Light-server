export const Sleepover_Applies = (sequelize, DataTypes) => {
  return sequelize.define('sleepover_apply', {
    apply_id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement : true
    },
    user_id : {
      type : DataTypes.INTEGER,
      primaryKey : true
      // ,
      // autoIncrement : true
    },
    created_at : {
      type : DataTypes.DATE,
      defalutValue : DataTypes.NOW
    }
  });
};