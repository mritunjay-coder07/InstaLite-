const prisma = require("../db");

exports.createUser = (data) =>
  prisma.user.create({
    data: {
      username: data.username.trim(),
      email: data.email.trim(),
      fullname: data.fullname,
      bio: data.bio,
      isPrivate: data.isPrivate ?? false,
    },
  });

exports.getUsers = () =>
  prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

exports.getUserById = (id) =>
  prisma.user.findUnique({
    where: { id },
    include: { posts: true },
  });

exports.updateUser = (id, data) => {
  const allowed = {};

  for (const key of ["username", "email", "fullname", "bio", "isPrivate"]) {
    if (data[key] !== undefined) allowed[key] = data[key];
  }

  if (typeof allowed.username === "string") {
    allowed.username = allowed.username.trim();
  }
  if (typeof allowed.email === "string") {
    allowed.email = allowed.email.trim();
  }

  return prisma.user.update({ where: { id }, data: allowed });
};

exports.deleteUser = (id) =>
  prisma.user.delete({ where: { id } });