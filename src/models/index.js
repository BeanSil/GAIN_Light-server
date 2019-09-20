import Sequelize from 'sequelize';
import path from 'path';

import { Account } from './Account';
import { Student } from './Student';
import { Teacher } from './Teacher';
import { Guest } from './Guest';
import { Board } from './Board';
import {Board_comment} from './Board_comment';
import {Board_likability} from './Board_likability';
import {Board_com_likability} from './Board_com_likability';

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
const board_comment = Board_comment(sequelize,Sequelize);
const board_likability = Board_likability(sequelize,Sequelize);
const board_com_likability = Board_com_likability(sequelize,Sequelize);

export { sequelize, Sequelize, account, student, teacher, guest, board, board_comment, board_likability,board_com_likability };