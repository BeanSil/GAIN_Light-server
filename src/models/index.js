import Sequelize from 'sequelize';
import path from 'path';

import { Account } from './Account';
import { Student } from './Student';
import { Teacher } from './Teacher';
import { Guest } from './Guest';
import { Board } from './board';
import {Board_comment} from './board_comment';
import {Board_likability} from './board_likability';
import {Board_com_likability} from './board_com_likability';
import {Board_data} from './board_data';
import { Room, RoomApply } from './Room';
import { Req_song } from './req_songs';

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
const req_song = Req_song(sequelize, Sequelize)
const board_comment = Board_comment(sequelize,Sequelize);
const board_likability = Board_likability(sequelize,Sequelize);
const board_com_likability = Board_com_likability(sequelize,Sequelize);
const board_data = Board_data(sequelize, Sequelize);
const room = Room(sequelize, Sequelize);
const roomApply = RoomApply(sequelize, Sequelize);

export { sequelize, Sequelize, account, student, teacher, guest, board, board_comment, board_likability,board_com_likability, board_data, room, roomApply, req_song };
