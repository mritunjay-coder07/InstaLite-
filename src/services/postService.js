const prisma = require("../db");

exports.createPost = (data) =>
  prisma.post.create({
    data: {
      imageUrl: data.imageUrl.trim(),
      caption: data.caption,
      location: data.location,
      authorId: data.authorId,
    },
    include: { author: true },
  });

exports.getPosts = () =>
  prisma.post.findMany({
    include: {
      author: true,
      _count: { select: { likes: true } },
    },
    orderBy: { createdAt: "desc" },
  });

exports.getPostById = (id) =>
  prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      _count: { select: { likes: true } },
    },
  });

exports.updatePost = (id, data) => {
  const allowed = {};

  for (const key of ["imageUrl", "caption", "location"]) {
    if (data[key] !== undefined) allowed[key] = data[key];
  }

  if (typeof allowed.imageUrl === "string") {
    allowed.imageUrl = allowed.imageUrl.trim();
  }

  return prisma.post.update({
    where: { id },
    data: allowed,
    include: { author: true },
  });
};

exports.deletePost = (id) =>
  prisma.post.delete({ where: { id } });