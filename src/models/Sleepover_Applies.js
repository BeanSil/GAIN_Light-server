export const Sleepover_Applies = (sequelize, DataTypes) => {
  return sequelize.define('sleepover_apply', {
    apply_id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      auto_increment : true
    },
    user_id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      auto_increment : true
    },
    created_at : {
      type : DataTypes.DATE,
      defalutValue : DataTypes.NOW
    }
  });
};