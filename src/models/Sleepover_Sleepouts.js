export const Sleepover_Sleepouts = (sequelize, DataTypes) => {
  return sequelize.define('sleepover_sleepout', {
    sleepout_id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement : true
    },
    user_id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement : true
    },
    date : {
      type : DataTypes.DATE,
      allowNull : false
    },
    reason : {
      type : DataTypes.TEXT
    },
    created_at : {
      type : DataTypes.DATE,
      default : now()
    }
  }); 
}