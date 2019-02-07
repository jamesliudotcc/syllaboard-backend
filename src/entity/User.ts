import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  Column,
  Entity,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';
import { Deliverable } from './Deliverable';

@Entity()
export class User {
  @ObjectIdColumn()
  // tslint:disable-next-line
  _id: ObjectID;

  @Column()
  firstName: string = '';

  @Column()
  lastName: string = '';

  @Column()
  email: string = '';

  @Column()
  password: string = '';

  @Column('enum')
  role: 'admin' | 'instructor' | 'student';

  @Column()
  deliverables: ObjectID[] = [];

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 12);
  }

  async validPassword(plainTextPassword: string) {
    return await bcrypt.compare(plainTextPassword, this.password + '');
  }
}
