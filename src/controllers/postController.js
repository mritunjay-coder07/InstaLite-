const service = require("../services/postService");

function parseId(value) {
  if (!/^[1-9]\d*$/.test(value)) return null;

  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

function handleError(res, error) {
  if (error.code === "P2025") {
    return res.status(404).json({ error: "Post or related record not found" });
  }

  if (error.code === "P2003") {
    return res.status(400).json({ error: "Invalid authorId" });
  }

  console.error(error);
  return res.status(500).json({ error: "Internal server error" });
}

exports.createPost = async (req, res) => {
  const { imageUrl, authorId } = req.body;

  if (
    typeof imageUrl !== "string" || !imageUrl.trim() ||
    !Number.isSafeInteger(authorId) || authorId < 1
  ) {
    return res.status(400).json({
      error: "A valid imageUrl and numeric authorId are required",
    });
  }

  try {
    const post = await service.createPost(req.body);
    return res.status(201).json({ data: post });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getPosts = async (req, res) => {
  try {
    return res.json({ data: await service.getPosts() });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getPostById = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid post ID" });

  try {
    const post = await service.getPostById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    return res.json({ data: post });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.updatePost = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid post ID" });

  try {
    return res.json({ data: await service.updatePost(id, req.body) });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.deletePost = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid post ID" });

  try {
    await service.deletePost(id);
    return res.json({ message: "Post deleted successfully" });
  } catch (error) {
    return handleError(res, error);
  }
};