import { prisma } from "../config/database";
import { ConsoleInput } from "../services/consoles-service";

async function getConsoles() {
  return prisma.console.findMany();
}

async function getSpecificConsole(id: number) {
  return prisma.console.findFirst({
    where: { id },
  });
}

async function getSpecificConsoleByName(name: string) {
  return prisma.console.findFirst({
    where: {
      name,
    },
  });
}

async function insertConsole(console: ConsoleInput) {
  return await prisma.console.create({
    data: console,
  });
}

const consolesRepository = {
  getConsoles,
  getSpecificConsole,
  getSpecificConsoleByName,
  insertConsole,
};

export default consolesRepository;
