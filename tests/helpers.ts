import { prisma } from "../src/config/database";

export async function cleanDb() {
  await prisma.game.deleteMany({});
  await prisma.console.deleteMany({});
}
