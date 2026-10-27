require("dotenv").config();

const app = require("./app");
const prisma = require("./db");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await prisma.$connect();

    app.listen(PORT, () => {
      console.log(`InstaLite running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    process.exit(1);
  }
}

startServer();

async function shutdown() {
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);