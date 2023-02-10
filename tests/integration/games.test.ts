import { faker } from "@faker-js/faker";
import app, { init } from "../../src/app";
import { prisma } from "../../src/config/database";
import httpStatus from "http-status";
import supertest from "supertest";
import { createConsole } from "../factories/consoles-factory";
import { createGame } from "../factories/games-factory";
import { cleanDb } from "../helpers";

beforeAll(async () => {
    await init();
  });

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /games", () => {
  it("should respond with empty array when there are no game data", async () => {
    const response = await server.get("/games");

    expect(response.body).toEqual([]);
  });

  it("should respond with array of games data", async () => {
    const consoleTest = await createConsole();
    const gameTest = await createGame(consoleTest.id);

    const response = await server.get("/games");

    expect(response.body).toEqual([{ ...gameTest, Console: consoleTest }]);
  });
});

describe("GET /games/:id", () => {
  it("should respond with status 404 when the game is not found", async () => {
    const response = await server.get("/games/0");

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it("should respond with game data", async () => {
    const consoleTest = await createConsole();
    const gameTest = await createGame(consoleTest.id);

    const response = await server.get(`/games/${gameTest.id}`);

    expect(response.body).toEqual(gameTest);
  });
});

describe("POST /games", () => {
  it("should respond with status 422 if body is invalid", async () => {
    const body = {};
    const response = await server.post("/games").send(body);

    expect(response.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should respond with status 409 if game name already exists", async () => {
    const consoleTest = await createConsole();
    const body = { title: faker.datatype.string(), consoleId: consoleTest.id };

    await server.post("/games").send(body);

    const response = await server.post("/games").send(body);

    expect(response.status).toEqual(httpStatus.CONFLICT);
  });

  it("should respond with status 201 on success", async () => {
    const consoleTest = await createConsole();
    const body = { title: faker.datatype.string(), consoleId: consoleTest.id };

    const response = await server.post("/games").send(body);

    const gameCreated = await prisma.game.findFirst({
      where: { title: body.title },
    });

    expect(response.status).toEqual(httpStatus.CREATED);
    expect(gameCreated).toBeDefined;
  });
});
