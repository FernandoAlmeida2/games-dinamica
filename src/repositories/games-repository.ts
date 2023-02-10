import { prisma } from "../config/database";
import { GameInput } from "../services/games-service";

async function getGames() {
  return prisma.game.findMany({
    include: {
      Console: true,
    },
  });
}

async function getSpecificGame(id: number) {
  return prisma.game.findFirst({
    where: { id },
  });
}

async function getSpecificGameByName(title: string) {
  return prisma.game.findFirst({
    where: {
      title,
    },
  });
}

async function insertGame(game: GameInput) {
  return await prisma.game.create({
    data: game,
  });
}

const gamesRepository = {
  getGames,
  getSpecificGame,
  getSpecificGameByName,
  insertGame,
};

export default gamesRepository;
