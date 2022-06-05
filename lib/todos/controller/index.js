let service = require("../service");
let response = require("../../responses");

exports.createTodo = async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return response.failedWithMessage("name is required in req body", res);
  }
  try {
    const userId = req.user.id;
    const result = await service.createTodo(name, description, userId);
    if (result?.code === 0) {
      return response.success(result?.data, res);
    } else if (result?.code === 1) {
      return response.failedWithMessage(result?.data, res);
    } else {
      return response.notAcceptable(res);
    }
  } catch (e) {
    console.error(e);
    return response.serverError(res);
  }
};

exports.getUserTodos = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await service.getUserTodos(userId);
    if (result?.code === 0) {
      return response.success(result?.data[0], res);
    } else if (result?.code === 1) {
      return response.failedWithMessage(result?.data, res);
    } else {
      return response.notAcceptable(res);
    }
  } catch (e) {
    console.error(e);
    return response.serverError(res);
  }
};

exports.getTodo = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const result = await service.getTodo(id, userId);
    if (result?.code === 0) {
      return response.success(result?.data, res);
    } else if (result?.code === 1) {
      return response.failedWithMessage(result?.data, res);
    } else {
      return response.notAcceptable(res);
    }
  } catch (e) {
    console.error(e);
    return response.serverError(res);
  }
};

exports.updateTodoCompleted = async (req, res) => {
  const {
    params: { id },
    body: { completed },
  } = req;
  if (completed === undefined) {
    return response.failedWithMessage("completed is required in req body", res);
  }
  try {
    const userId = req.user.id;
    const result = await service.updateTodoCompleted(id, userId, completed);
    if (result?.code === 0) {
      return response.success(result?.data, res);
    } else if (result?.code === 1) {
      return response.failedWithMessage(result?.data, res);
    } else {
      return response.notAcceptable(res);
    }
  } catch (e) {
    console.error(e);
    return response.serverError(res);
  }
};

exports.updateTodo = async (req, res) => {
  const {
    params: { id },
    body: { completed, name, description },
  } = req;
  if (completed === undefined || !name || !description) {
    return response.failedWithMessage(
      "completed and name are required in req body",
      res
    );
  }
  try {
    const userId = req.user.id;
    const result = await service.updateTodo(
      id,
      userId,
      completed,
      description,
      name
    );
    if (result?.code === 0) {
      return response.success(result?.data, res);
    } else if (result?.code === 1) {
      return response.failedWithMessage(result?.data, res);
    } else {
      return response.notAcceptable(res);
    }
  } catch (e) {
    console.error(e);
    return response.serverError(res);
  }
};

exports.deleteTodo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const userId = req.user.id;
    const result = await service.deleteTodo(id, userId);
    if (result?.code === 0) {
      return response.success(result?.data, res);
    } else if (result?.code === 1) {
      return response.failedWithMessage(result?.data, res);
    } else {
      return response.notAcceptable(res);
    }
  } catch (e) {
    console.error(e);
    return response.serverError(res);
  }
};
