const prisma = require("../db");

exports.createUser = (data) => {
  return prisma.user.create({
    data: {
      username: data.username.trim(),
      email: data.email.trim(),
      fullname: data.fullname,
      bio: data.bio,
      isPrivate: data.isPrivate ?? false,
    },
  });
};

exports.getUsers = ({ q, limit = 10, offset = 0 } = {}) => {
  const where = q
    ? {
        OR: [
          { username: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  return prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
};

exports.getUserById = (id) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { posts: true, likes: true } },
    },
  });
};

exports.updateUser = (id, data) => {
  const allowed = {};

  for (const key of ["username", "email", "fullname", "bio", "isPrivate"]) {
    if (data[key] !== undefined) {
      allowed[key] = data[key];
    }
  }

  if (typeof allowed.username === "string") {
    allowed.username = allowed.username.trim();
  }

  if (typeof allowed.email === "string") {
    allowed.email = allowed.email.trim();
  }

  return prisma.user.update({
    where: { id },
    data: allowed,
  });
};

exports.deleteUser = (id) => {
  return prisma.user.delete({
    where: { id },
  });
};