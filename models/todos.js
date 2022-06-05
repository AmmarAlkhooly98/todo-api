"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class todos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      todos.belongsTo(models.users, { foreignKey: "id" });
    }
  }
  todos.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      completed: DataTypes.BOOLEAN,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "todos",
    }
  );
  return todos;
};
