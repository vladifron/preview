import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  DataType,
  IsUUID,
  Column,
  Model,
  Table,
} from 'sequelize-typescript';

import { Role, RolePermission } from '@modules/role/models';

import { PermissionEnum } from '@modules/role/enums';

@Table({
  tableName: 'permission',
  paranoid: true,
})
export class Permission extends Model {
  @IsUUID(4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty({ type: String, example: '49a37307-96cc-49fd-9eff-5e287e6d805' })
  id: string;

  @ApiProperty({ type: String, example: '***' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  value: PermissionEnum;

  @BelongsToMany(() => Role, () => RolePermission)
  roles: Role[];
}
