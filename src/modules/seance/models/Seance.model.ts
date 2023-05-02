import {
  ForeignKey,
  AllowNull,
  BelongsTo,
  DataType,
  Column,
  IsUUID,
  Model,
  Table,
} from 'sequelize-typescript';

import { User } from '@modules/user/models';

@Table({ tableName: 'seances' })
export class Seance extends Model {
  @IsUUID(4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  value: string;

  @BelongsTo(() => User)
  user: User;
}
