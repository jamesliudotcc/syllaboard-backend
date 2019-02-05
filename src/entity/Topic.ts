import { Column } from 'typeorm';

export class Topic {
  @Column()
  question: string;

  @Column()
  numOfAnswers: number;

  @Column()
  answers: string[]; // user
}
