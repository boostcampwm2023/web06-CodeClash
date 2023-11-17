import {
  IsEmail,
  IsString,
  Length,
  ValidationArguments,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

enum Role {
  USER = 'user',
  ADMIN = 'amdin',
}

@Entity({ name: 'users' })
export class UserTable {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ length: 500, unique: true })
  @IsString({
    message: (args: ValidationArguments) => {
      return `${args.property} must be a string`;
    },
  })
  @Length(6, 20, {
    message: (args: ValidationArguments) => {
      return `${args.property} must be between 6 and 20 characters`;
    },
  })
  name: string;

  @Column({ length: 500 })
  @IsString({
    message: (args: ValidationArguments) => {
      return `${args.property} must be a string`;
    },
  })
  @IsEmail(
    {},
    {
      message: (args: ValidationArguments) => {
        return `${args.property} must be a valid email`;
      },
    },
  )
  email: string;

  @Column({ length: 500 })
  @IsString({
    message: (args: ValidationArguments) => {
      return `${args.property} must be a string`;
    },
  })
  @Length(6, 20, {
    message: (args: ValidationArguments) => {
      return `${args.property} must be between 6 and 20 characters`;
    },
  })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;
}
