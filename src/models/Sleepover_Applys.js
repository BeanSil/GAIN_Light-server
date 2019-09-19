export const Sleepover_Applys = (sequelize, DataTypes) => {
  return sequelize.define('Sleepover_Applys', {
    apply_id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      allowNull : false
    },
    user_id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      allowNull : false
    },
    created_at : {
      type : DataTypes.Datetime,
      defalut : now()
    }
  });
};