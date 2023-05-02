'use strict';

export default {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((t) => {

    });
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((t) => {
    });
  },
};
