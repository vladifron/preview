import { FindOptions } from 'sequelize';


export const FOUserById = (id: string): FindOptions => ({
  include: [
    {
      model: '***',
      through: { attributes: [] },
      attributes: {
        exclude: ['***', '***', '***'],
      },
      include: [
        {
          model: '***',
          attributes: {
            exclude: ['***', '***', '***'],
          },
        },
      ],
    },
  ],
  where: { id },
  attributes: {
    exclude: ['***', '***', '***'],
  },
});
