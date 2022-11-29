process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("./app");
const items = require("./fakeDb");

let popsicle = { name: "popsicle", price: 1.45 };

beforeEach(() => {
  items.push(popsicle);
});

afterEach(() => {
  items.length = 0;
});

describe("test READ", () => {
  test("Get a list of items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([popsicle]);
  });

  test("Get an item", async () => {
    const res = await request(app).get(`/items/${popsicle.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(popsicle);
  });

  test("Get an non-existing item and respond with 404", async () => {
    const res = await request(app).get("/items/popcorn");
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "Item not found", status: 400 });
  });
});

describe("test CREATE", () => {
  test("Create a new item", async () => {
    const newItem = { name: "cheerios", price: 3.4 };
    const res = await request(app).post("/items").send(newItem);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: newItem });
    expect(items.length).toBe(2);
  });

  test("Respond with 400 if no valid information provided", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "No item posted", status: 400 });
    expect(items.length).toBe(1);
  });
});

describe("test UPDATE", () => {
  test("Update an item", async () => {
    const res = await request(app)
      .patch(`/items/${popsicle.name}`)
      .send({ price: 2.45 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ updated: { name: "popsicle", price: 2.45 } });
    expect(items.length).toBe(1);
  });

  test("Update a non-existing item and respond with 404", async () => {
    const res = await request(app)
      .patch("/items/popcorn")
      .send({ price: 2.45 });
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: "Item not found", status: 404 });
    expect(items.length).toBe(1);
  });
});

describe("test DELETE", () => {
  test("Delete an item", async () => {
    const res = await request(app).delete(`/items/${popsicle.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "deleted" });
    expect(items.length).toBe(0);
  });

  test("Delete a non-existing item and respond with 404", async () => {
    const res = await request(app).delete("/items/popcorn");
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: "Item not found", status: 404 });
    expect(items.length).toBe(1);
  });
});
