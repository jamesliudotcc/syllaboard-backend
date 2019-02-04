import {
    Entity,
    Column,
    BeforeInsert,
    ObjectIdColumn,
    ObjectID,
  } from 'typeorm';

{user: {_id: ObjectID, name: string, email: string, password: string}} // Import from User entity

@Entity()
export class Assignment {
    @ObjectIdColumn()
    _id: ObjectID;

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

@Entity()
export class Cohort {
    @ObjectIdColumn()
    _id: ObjectID;

    @Column()
    name: string

    @Column()
    campus: string

    @Column()
    students: ObjectID[] //user

    @Column()
    instructors: ObjectID[] // User

    @Column()
    startDate: Date

    @Column()
    endDate: Date
}

