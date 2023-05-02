import {
  ForeignKey,
  BelongsTo,
  DataType,
  Column,
  IsUUID,
  Model,
  Table,
} from 'sequelize-typescript';

import { Role, Permission } from '@modules/role/models';

@Table({ tableName: 'role_permission', paranoid: true })
export class RolePermission extends Model {
  @IsUUID(4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  roleId: string;

  @ForeignKey(() => Permission)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  permissionId: string;

  @BelongsTo(() => Role)
  role: Role;

  @BelongsTo(() => Permission)
  permission: Permission;
}
