import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Cohort {
  @ObjectIdColumn()
  // tslint:disable-next-line
  _id: ObjectID;

  @Column()
  name: string;

  @Column()
  campus: string;

  @Column()
  students: ObjectID[]; // user

  @Column()
  instructors: ObjectID[]; // User

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
}
