const service = require("../services/userService");

function parseId(value) {
  if (!/^[1-9]\d*$/.test(value)) return null;

  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

function handleError(res, error) {
  if (error.code === "P2002") {
    return res.status(409).json({ error: "Username or email already exists" });
  }

  if (error.code === "P2025") {
    return res.status(404).json({ error: "User not found" });
  }

  console.error(error);
  return res.status(500).json({ error: "Internal server error" });
}

exports.createUser = async (req, res) => {
  const { username, email } = req.body;

  if (
    typeof username !== "string" || !username.trim() ||
    typeof email !== "string" || !email.trim()
  ) {
    return res.status(400).json({ error: "Username and email are required" });
  }

  try {
    const user = await service.createUser(req.body);
    return res.status(201).json({ data: user });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getUsers = async (req, res) => {
  try {
    return res.json({ data: await service.getUsers() });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getUserById = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid user ID" });

  try {
    const user = await service.getUserById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ data: user });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.updateUser = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid user ID" });

  try {
    return res.json({ data: await service.updateUser(id, req.body) });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.deleteUser = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid user ID" });

  try {
    await service.deleteUser(id);
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return handleError(res, error);
  }
};