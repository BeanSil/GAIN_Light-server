export const Rooms = (sequelize, DataTypes) => {
    return sequelize.define("Rooms", {
        allocation_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        room_no: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        year: {
            type: DataTypes.YEAR,
            allowNull: false
        },
        quarter: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
};