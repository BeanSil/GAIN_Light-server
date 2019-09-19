export const Sleepover_Goouts = (sequelize, DataTypes) => {
  return sequelize.define('Sleepover_Goouts', {
    goout_id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement : true
    },
    user_id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement : true
    },
    start_time : {
      type : DataTypes.DATE,
      allowNull : false
    },
    end_time : {
      type : DataTypes.DATE,
      allowNull : false
    },
    reason : {
      type : DataTypes.TEXT
    },
    have_phone : {
      type : DataTypes.BOOLEAN,
      defalut : true
    },
    created_at : {
      type : DataTypes.DATE,
      default : now()
    }
  }); 
}