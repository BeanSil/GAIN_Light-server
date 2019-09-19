import { now } from "moment";

export const Lrnrooms = (sequelize, DataTypes) => {
    return sequelize.define('Lrnrooms', {
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
    return sequelize.define('Lrnseat_recommend', {
        sr_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        lrnseat_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Lrnseats',
                key: 'lrnseat_id'
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Accounts',
                key: 'user_id'
            }
        },
        rental_time: {
            type: DataTypes.DATE,
            default: now()
        }
    });
};

export const Lrnseats = (sequelize, DataTypes) => {
    return sequelize.define('Lrnseats', {
        lrnseat_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        lrnroom_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Lrnrooms',
                key: 'lrnroom_id'
            }
        },
        seat_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
};