const express = require("express");
const controller = require("../controllers/postController");

const router = express.Router();

router.post("/", controller.createPost);
router.get("/", controller.getPosts);
router.get("/:id", controller.getPostById);
router.patch("/:id", controller.updatePost);
router.delete("/:id", controller.deletePost);

module.exports = router;