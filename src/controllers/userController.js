const service = require("../services/userService");

function parseId(value) {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id <= 0) return null;

  return id;
}

function handleError(res, error) {
  if (error.code === "P2002") {
    return res.status(409).json({
      error: "Username or email already exists",
    });
  }

  if (error.code === "P2025") {
    return res.status(404).json({
      error: "User not found",
    });
  }

  console.error(error);

  return res.status(500).json({
    error: "Internal server error",
  });
}

exports.createUser = async (req, res) => {
  const { username, email, isPrivate } = req.body;

  if (
    typeof username !== "string" ||
    !username.trim() ||
    typeof email !== "string" ||
    !email.trim()
  ) {
    return res.status(400).json({
      error: "Username and email are required",
    });
  }

  if (isPrivate !== undefined && typeof isPrivate !== "boolean") {
    return res.status(400).json({
      error: "isPrivate must be a boolean",
    });
  }

  try {
    const user = await service.createUser(req.body);

    return res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getUsers = async (req, res) => {
  const limit = Number(req.query.limit ?? 10);
  const offset = Number(req.query.offset ?? 0);
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";

  if (
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100 ||
    !Number.isInteger(offset) ||
    offset < 0
  ) {
    return res.status(400).json({
      error: "limit must be between 1 and 100 and offset must be non-negative",
    });
  }

  try {
    const users = await service.getUsers({ q, limit, offset });

    return res.status(200).json({
      success: true,
      data: users,
      count: users.length,
      limit,
      offset,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getUserById = async (req, res) => {
  const id = parseId(req.params.id);

  if (id === null) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const user = await service.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.updateUser = async (req, res) => {
  const id = parseId(req.params.id);

  if (id === null) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const { username, email, isPrivate } = req.body;

  if (
    username !== undefined &&
    (typeof username !== "string" || !username.trim())
  ) {
    return res.status(400).json({
      error: "Username must be a non-empty string",
    });
  }

  if (
    email !== undefined &&
    (typeof email !== "string" || !email.trim())
  ) {
    return res.status(400).json({
      error: "Email must be a non-empty string",
    });
  }

  if (isPrivate !== undefined && typeof isPrivate !== "boolean") {
    return res.status(400).json({
      error: "isPrivate must be a boolean",
    });
  }

  try {
    const user = await service.updateUser(id, req.body);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.deleteUser = async (req, res) => {
  const id = parseId(req.params.id);

  if (id === null) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    await service.deleteUser(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return handleError(res, error);
  }
};