import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity("files")
export class File {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  filename: string;

  @Column()
  username: string;

  @OneToOne(() => User, { eager: true })
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
