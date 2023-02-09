import { faker } from "@faker-js/faker";
import { prisma } from "../../src/config/database";

export async function createConsole() {
  return prisma.console.create({
    data: {
      name: faker.company.name(),
    },
  });
}
