import { Sequelize } from 'sequelize';

export const transaction = (
  sequelize: Sequelize,
  callback,
): typeof callback => {
  return sequelize.transaction(callback);
};
