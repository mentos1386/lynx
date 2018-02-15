import { File } from '../file/file.entity';
import {
  Column, CreateDateColumn, OneToOne, PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { USER_ROLE } from './user.constants';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @Column()
  password: string;

  @OneToOne(() => File, { eager: true })
  profileImage: File;

  @Column({ default: USER_ROLE.DEFAULT, type: 'enum', enum: USER_ROLE })
  role: USER_ROLE;

  @Column({ default: false })
  blocked: boolean;

  @Column({ type: 'jsonb', default: {} })
  profile: {
    name?: string;
    surname?: string;
    phone?: string;
    description?: string;
  };

  @Column({ type: 'jsonb' })
  oauth: {
    google?: {
      userId: string,
    },
    facebook?: {
      userId: string,
    },
  };

  @Column()
  unverifiedEmail: string;

  @Column()
  lastLogin: Date;

  get fullName(): string {
    return this.profile.name + (this.profile.surname ? ' ' + this.profile.surname : '');
  }

}
