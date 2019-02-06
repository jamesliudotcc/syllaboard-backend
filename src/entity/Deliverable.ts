import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { Topic } from './Topic';

export class Deliverable {
  @ObjectIdColumn()
  // tslint:disable-next-line
  _id: ObjectID;

  @Column()
  name: string;

  @Column()
  instructor: ObjectID[] = [];

  @Column()
  instructions: string; // this is the instructor’s notes on what should be accomplished.

  @Column()
  resourcesUrls: string[]; // optional

  @Column(type => Topic)
  topics: Topic[] = [];

  @Column()
  deadline: Date;

  @Column()
  turnedIn: Date | null = null; // Maybe just a Boolean?

  @Column() // null indicates not turned in.
  completed: Date | null = null; // Date indicates acceptance of assignment

  @Column()
  deliverable: string | null; // URL to deliverable, Google Doc, or whatever.

  @Column()
  grade: number | null; // 1-3 usually around 2.1-2.6
}
