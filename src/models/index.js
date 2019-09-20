import Sequelize from 'sequelize';
import path from 'path';

import { Account } from './Account';
import { Student } from './Student';
import { Teacher } from './Teacher';
import { Guest } from './Guest';
import { Board } from './Board';
import { Lrnrooms, Lrnseats, Lrnseat_recommend} from './Lrnrooms';

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
const lrnrooms = Lrnrooms(sequelize, Sequelize);
const lrnseats = Lrnseats(sequelize, Sequelize);
const lrnseat_recommend = Lrnseat_recommend(sequelize, Sequelize);


export { sequelize, Sequelize, account, student, teacher, guest, board, lrnrooms, lrnseats, lrnseat_recommend};