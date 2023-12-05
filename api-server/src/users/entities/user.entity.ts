import { IsEmail, IsString, Length } from 'class-validator';
import { BaseTable } from 'src/common/entities/base-table.entity';
import { SubmissionTable } from 'src/submissions/entities/submission.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { stringValidationMessage } from '../../common/validation-messages/string.validation-message';
import { lengthValidationMessage } from 'src/common/validation-messages/length.validation-message';
import { emailValidationMessage } from 'src/common/validation-messages/email.validation-message';

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity({ name: 'user' })
export class UserTable extends BaseTable {
  @Column({ length: 500, unique: true })
  @IsString({
    message: stringValidationMessage,
  })
  @Length(2, 20, {
    message: lengthValidationMessage,
  })
  name: string;

  @Column({ length: 500 })
  @IsEmail(
    {},
    {
      message: emailValidationMessage,
    },
  )
  email: string;

  @Column({ length: 500 })
  @IsString({
    message: stringValidationMessage,
  })
  @Length(6, 20, {
    message: lengthValidationMessage,
  })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ type: 'int', default: 0 })
  acceptCount: number;

  @Column({ type: 'int', default: 0 })
  failCount: number;

  @Column({ type: 'int', default: 0 })
  winCount: number;

  @Column({ type: 'int', default: 0 })
  totalCount: number;

  @OneToMany(() => SubmissionTable, (submission) => submission.user)
  submissions: SubmissionTable[];
}
