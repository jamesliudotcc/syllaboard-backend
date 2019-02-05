import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';
import { Topic } from './Topic';

@Entity()
export class Deliverable {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  name: string;

  @Column()
  student: string; // Refs user

  @Column()
  instructor: string;

  @Column()
  instructions: string; // this is the instructor’s notes on what should be accomplished.

  @Column()
  resourcesUrls: string[]; // optional

  @Column(type => Topic)
  topics: Topic[];

  @Column()
  deadline: Date;

  @Column()
  turnedIn: Date | null; // Maybe just a Boolean?

  @Column() // null indicates not turned in.
  completed: Date | null; // Date indicates acceptance of assignment

  @Column()
  deliverable: string | null; // URL to deliverable, Google Doc, or whatever.

  @Column()
  grade: Number | null; // 1-3 usually around 2.1-2.6
}
