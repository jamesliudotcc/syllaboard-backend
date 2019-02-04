import {
  Entity,
  Column,
  BeforeInsert,
  ObjectIdColumn,
  ObjectID,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  name: string = '';

  @Column()
  email: string = '';

  @Column()
  password: string = '';

  @Column('enum')
  role: 'admin' | 'instructor' | 'student';

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 12);
  }

  async validPassword(plainTextPassword: string) {
    return await bcrypt.compare(plainTextPassword, this.password + '');
  }
}
