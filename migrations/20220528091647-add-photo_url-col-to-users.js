"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.addColumn("users", "image", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue:
        "https://firebasestorage.googleapis.com/v0/b/todov2-73a0e.appspot.com/o/images%2Fuser-placeholder.jpeg?alt=media",
    });
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.removeColumn("users", "image");
  },
};
