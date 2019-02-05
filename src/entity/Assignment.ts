import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { Topic } from './Topic';

@Entity()
export class Assignment {
  @ObjectIdColumn()
  // tslint:disable-next-line
  _id: ObjectID;

  @Column()
  name: string;

  @Column()
  version: number;

  @Column()
  cohortType: string; // Refs cohort

  @Column()
  cohortWeek: string; // When should this be assigned

  @Column()
  instructor: string; // Who does this belong to? Instructor can filter for own and other instructors' materials

  @Column()
  instructions: string; // this is the instructor’s notes on what should be accomplished.

  @Column()
  resourcesUrls: string[]; // optional

  @Column(type => Topic)
  topics: Topic[];
}
