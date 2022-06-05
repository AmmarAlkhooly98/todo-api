"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    let addColTodos = await queryInterface.addColumn("todos", "deletedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    let addColUsers = await queryInterface.addColumn("users", "deletedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    return Promise.all([addColTodos, addColUsers]);
  },

  async down(queryInterface, Sequelize) {
    let removeColTodos = await queryInterface.removeColumn(
      "todos",
      "deletedAt"
    );
    let removeColUsers = await queryInterface.removeColumn(
      "users",
      "deletedAt"
    );
    Promise.all([removeColTodos, removeColUsers]);
  },
};
