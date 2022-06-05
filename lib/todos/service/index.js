const { sequelize, users, todos } = require("../../../models");

exports.createTodo = async (name, description = null, userId) => {
  try {
    const query = `INSERT INTO todos
                   (name, description, user_id)
                   VALUES (:name, :description, :userId);`;
    const data = await sequelize.query(query, {
      replacements: {
        name,
        description,
        userId,
      },
      type: sequelize.QueryTypes.INSERT,
    });
    if (data[1] === 1) {
      return { code: 0, data: { id: data[0] } };
    } else {
      return { code: 1, data: "failed to add todo" };
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

exports.getUserTodos = async (userId) => {
  try {
    const data = await users.findAll({
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      include: [
        {
          model: todos,
          where: { user_id: userId, deletedAt: null },
        },
      ],
    });
    if (data.length > 0) {
      return { code: 0, data };
    } else if (data.length === 0) {
      return { code: 0, data: "user has no todos" };
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};
exports.getTodo = async (id, userId) => {
  try {
    const query = `SELECT 
    t.id,
    t.name,
    t.description,
    t.completed,
    t.createdAt,
    u.first_name,
    u.last_name,
    u.email
FROM
    todos t
        JOIN
    users u ON t.user_id = u.id
WHERE
    t.user_id = :userId AND t.id = :id
        AND t.deletedAt IS NULL;`;
    const data = await sequelize.query(query, {
      replacements: {
        userId,
        id,
      },
      type: sequelize.QueryTypes.SELECT,
    });
    if (data.length > 0) {
      return { code: 0, data: data };
    } else if (data.length === 0) {
      return { code: 1, data: "todo not found" };
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

exports.updateTodoCompleted = async (id, userId, completed) => {
  try {
    let query = `UPDATE todos 
    SET 
        completed = :completed
    WHERE
        id = :id AND user_id = :userId;`;
    const data = await sequelize.query(query, {
      replacements: {
        id,
        userId,
        completed,
      },
      type: sequelize.QueryTypes.UPDATE,
    });
    if (data[1] === 1) {
      return { code: 0, data: "todo updated" };
    } else {
      return { code: 1, data: "failed to update todo" };
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

exports.updateTodo = async (
  id,
  userId,
  completed,
  description = null,
  name
) => {
  try {
    let query = `UPDATE todos 
    SET 
        completed = :completed,
        name = :name,
        description = :description
    WHERE
        id = :id AND user_id = :userId;`;
    const data = await sequelize.query(query, {
      replacements: {
        id,
        userId,
        completed,
        description,
        name,
      },
      type: sequelize.QueryTypes.UPDATE,
    });
    if (data[1] === 1) {
      return { code: 0, data: "todo updated" };
    } else {
      return { code: 1, data: "failed to update todo" };
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

exports.deleteTodo = async (id, userId) => {
  try {
    let query = `UPDATE todos 
    SET 
        deletedAt = now()
    WHERE
        id = :id AND user_id = :userId;`;
    const data = await sequelize.query(query, {
      replacements: {
        id,
        userId,
      },
      type: sequelize.QueryTypes.UPDATE,
    });
    if (data[1] === 1) {
      return { code: 0, data: "todo deleted" };
    } else {
      return { code: 1, data: "failed to delete todo" };
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};
