export const Room = (sequelize, DataTypes) => {
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

export const RoomApply = (sequelize, DataTypes) => {
    return sequelize.define("room_apply", {
        apply_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id2: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id3: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id4: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id5: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    })
};