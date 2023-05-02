import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  DataType,
  HasMany,
  Unique,
  IsUUID,
  Column,
  Model,
  Table,
} from 'sequelize-typescript';

import { Hasher } from '@common/utils';

import { Seance } from '@modules/seance/models';
import { Role } from '@modules/role/models';

const hasher: Hasher = new Hasher();

@Table({ tableName: 'user', paranoid: true })
export class User extends Model {
  @IsUUID(4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty({ type: String, example: '49a37307-96cc-49fd-9eff-5e287e6d805' })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty({ type: String, example: 'First Name' })
  firstName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty({ type: String, example: 'Last Name' })
  lastName: string;

  @Unique
  @Column
  @ApiProperty({ type: String, example: 'user.email@mail.ru' })
  email: string;

  @Column({
    allowNull: false,
    set(value: string) {
      this.setDataValue('password', hasher.hash(value));
    },
  })
  password: string;

  @HasMany(() => Seance)
  token: Seance[];

  @ApiProperty({ type: () => [Role] })
  @BelongsToMany(() => Role, () => ****)
  roles: Role[];
}
