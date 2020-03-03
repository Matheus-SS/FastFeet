'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameTable('deliverymen', 'deliverymans');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameTable('deliverymans', 'deliverymen');
  },
};
