import { FindOptions } from 'sequelize';

import { User } from '@modules/user/models';

export const FOIncludeUserById = (id: string): FindOptions => ({
  include: {
    model: User,
    required: true,
    attributes: [],
    where: { id },
  },
});
