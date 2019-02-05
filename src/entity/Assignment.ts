import {
    Entity,
    Column,
    BeforeInsert,
    ObjectIdColumn,
    ObjectID,
  } from 'typeorm';


@Entity()
export class Assignment {
    @ObjectIdColumn()
    _id: ObjectID;
    
    @Column()
    name: string; // Refs user
    
    @Column()
    student: string; // Refs user

    @Column()
    instructor: string;

    @Column()
    instructions: string; // this is the instructor’s notes on what should be accomplished.

    @Column()
    resourcesUrls: string[]; // optional

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
