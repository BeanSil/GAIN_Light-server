export const Lrnrooms = (sequelize, DataTypes) => {
    return sequelize.define('lrnroom', {
        lrnroom_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        object: {
            type: DataTypes.STRING(10),
            allowNull: false
        }
    });
};

export const Lrnseat_recommend = (sequelize, DataTypes) => {
    return sequelize.define('lrnseat_recommend', {
        sr_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        lrnseat_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rental_time: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW
        }
    });
};

export const Lrnseats = (sequelize, DataTypes) => {
    return sequelize.define('lrnseat', {
        lrnseat_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        lrnroom_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        seat_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
};