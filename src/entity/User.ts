import {
  Entity,
  Column,
  BeforeInsert,
  ObjectIdColumn,
  ObjectID,
  AfterInsert,
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
    console.log('At typeorm');
    this.password = bcrypt.hashSync(this.password, 12);
  }

  @AfterInsert()
  toJSON() {
    return JSON.stringify({
      _id: this._id,
      user: this.name,
      email: this.email,
    });
  }

  async validPassword(plainTextPassword: string) {
    return await bcrypt.compare(plainTextPassword, this.password + '');
  }
}
