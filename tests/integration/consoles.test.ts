import { faker } from "@faker-js/faker";
import app, { init } from "../../src/app";
import { prisma } from "../../src/config/database";
import httpStatus from "http-status";
import supertest from "supertest";
import { createConsole } from "../factories/consoles-factory";
import { cleanDb } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /consoles", () => {
  it("should respond with empty array when there are no console data", async () => {
    const response = await server.get("/consoles");
    
    expect(response.body).toEqual([]);
  });

  it("should respond with array of console data", async () => {
    const consoleTest = await createConsole();
    const response = await server.get("/consoles");

    expect(response.body).toEqual([consoleTest]);
  });
});

describe("GET /consoles/:id", () => {
  it("should respond with status 404 when the console is not found", async () => {
    const response = await server.get("/consoles/0");

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it("should respond with console data", async () => {
    const consoleTest = await createConsole();
    const response = await server.get(`/consoles/${consoleTest.id}`);

    expect(response.body).toEqual(consoleTest);
  });
});

describe("POST /consoles", () => {
  it("should respond with status 422 if body is invalid", async () => {
    const body = {};
    const response = await server.post("/consoles").send(body);

    expect(response.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should respond with status 409 if console name already exists", async () => {
    const body = { name: faker.company.name() };
    await server.post("/consoles").send(body);
    const response = await server.post("/consoles").send(body);

    expect(response.status).toEqual(httpStatus.CONFLICT);
  });

  it("should respond with status 201 on success", async () => {
    const body = { name: faker.company.name() };

    const response = await server.post("/consoles").send(body);

    const consoleCreated = await prisma.console.findFirst({
      where: { name: body.name },
    });

    expect(response.status).toEqual(httpStatus.CREATED);
    expect(consoleCreated).toBeDefined;
  });
});
