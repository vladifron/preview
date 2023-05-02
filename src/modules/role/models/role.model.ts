import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  DataType,
  IsUUID,
  Column,
  Model,
  Table,
} from 'sequelize-typescript';

import { RolePermission, Permission } from '@modules/role/models';

import { RoleEnum } from '@modules/role/enums';

@Table({ tableName: 'role', paranoid: true })
export class Role extends Model {
  @IsUUID(4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty({ type: String, example: '49a37307-96cc-49fd-9eff-5e287e3b649' })
  id: string;

  @ApiProperty({ type: String, example: 'Менеджер' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: false })
  value: RoleEnum;

  @ApiProperty({ type: () => [Permission], required: false })
  @BelongsToMany(() => Permission, () => RolePermission)
  permissions: Permission[];
}
