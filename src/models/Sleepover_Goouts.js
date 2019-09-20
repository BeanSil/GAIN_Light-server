export const Sleepover_Goouts = (sequelize, DataTypes) => {
  return sequelize.define('sleepover_goout', {
    goout_id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      auto_increment : true
    },
    user_id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      auto_increment : true
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
      defalutValue : DataTypes.NOW
    }
  }); 
}