import express from "express";
import request from "supertest";
import { POST } from "../../src/app/api/user/route";

const app = express();
app.use(express.json());

app.post("/api/user", async (req, res) => {
    const reqClone = new Request("http://localhost:3000", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body),
  });

  const response = await POST(reqClone);
  const data = await response.json();
  res.status(response.status || 200).json(data);
});

describe("POST /api/user", () => {
  it("creates a new user", async () => {
    const response = await request(app)
      .post("/api/user")
      .send({ name: "Test User", studentNumber: "12345" });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Test User");
    expect(response.body.studentNumber).toBe("12345");
  });

  it("returns existing user if studentNumber exists", async () => {
    // Create user first
    await request(app)
      .post("/api/user")
      .send({ name: "Existing User", studentNumber: "existing123" });

    // Then call again to fetch
    const response = await request(app)
      .post("/api/user")
      .send({ name: "Different Name", studentNumber: "existing123" });

    expect(response.status).toBe(200);
    expect(response.body.studentNumber).toBe("existing123");
    // Name remains as stored originally
    expect(response.body.name).toBe("Existing User");
  });

  it("returns 400 if missing fields", async () => {
    const response = await request(app)
      .post("/api/user")
      .send({ name: "No Student Number" });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Name and studentNumber are required");
  });
});
