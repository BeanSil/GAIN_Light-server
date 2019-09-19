export const Sleepover_Applys = (sequelize, DataTypes) => {
  return sequelize.define('Sleepover_Applys', {
    apply_id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement : true
    },
    user_id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement : true
    },
    created_at : {
      type : DataTypes.Datetime,
      defalut : now()
    }
  });
};