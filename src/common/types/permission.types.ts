import { PermissionEnum } from '@modules/role/enums';
import { SYSTEM_PERMISSION } from '@common/consts';

type TSystem = typeof SYSTEM_PERMISSION;

export type TPermission = TSystem | PermissionEnum;
