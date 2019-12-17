export const Room = (sequelize, DataTypes) => {
    return sequelize.define("room", {
        allocation_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        room_no: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_banned: {
            type: DataTypes.TINYINT,
            default: 0
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quarter: {
            type: DataTypes.TINYINT,
            allowNull: false
        }
    }, {
        timestamps: false
    });
};

export const RoomApply = (sequelize, DataTypes) => {
    return sequelize.define("room_apply", {
        apply_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        length: {
            type: DataTypes.TINYINT,
            allowNull: false
        },
        user_id1: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id2: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id3: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        user_id4: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        user_id5: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        timestamps: false
    });
};