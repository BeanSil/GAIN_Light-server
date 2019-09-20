import Sequelize from 'sequelize';
import path from 'path';

import { Account } from './Account';
import { Student } from './Student';
import { Teacher } from './Teacher';
import { Guest } from './Guest';
import { Board } from './Board';
import {Points} from './Points';
import {PointReasons} from './PointReasons';

const config = require(path.join(__dirname, '..', 'config', 'dbconfig.json'))['gain'];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config  
)

const account = Account(sequelize, Sequelize);
const student = Student(sequelize, Sequelize);
const teacher = Teacher(sequelize, Sequelize);
const guest = Guest(sequelize, Sequelize);
const board = Board(sequelize, Sequelize);
const points=Points(sequelize,Sequelize);
const pointReason=PointReasons(sequelize,Sequelize);

export {pointReason,points, sequelize, Sequelize, account, student, teacher, guest, board };