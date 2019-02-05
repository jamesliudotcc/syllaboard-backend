import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class Cohort {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  name: string;

  @Column()
  campus: string;

  @Column()
  students: ObjectID[]; //user

  @Column()
  instructors: ObjectID[]; // User

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
}
