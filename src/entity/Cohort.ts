import {
  BeforeInsert,
  Column,
  Entity,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';

// tslint:disable:no-var-requires
const en = require('nanoid-good/locale/en');
const nanoid = require('nanoid-good')(en);
// tslint:enable:no-var-requires

@Entity()
export class Cohort {
  @ObjectIdColumn()
  // tslint:disable-next-line
  _id: ObjectID;

  @Column()
  studentKey: string;

  @Column()
  instructorKey: string;

  @Column()
  name: string;

  @Column()
  campus: string;

  @Column()
  students: ObjectID[] = []; // User

  @Column()
  instructors: ObjectID[] = []; // User

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @BeforeInsert()
  generateKey() {
    this.studentKey = nanoid();
    this.instructorKey = nanoid();
  }
}
