import express from "express";
import request from "supertest";
import { POST as saveProgress } from "../../src/app/api/progress/save/route";
import { GET as loadProgress } from "../../src/app/api/progress/load/route";
import { POST as createUser } from "../../src/app/api/user/route";

const app = express();
app.use(express.json());

let userId: number;

// Set up a user for all progress endpoint tests
beforeAll(async () => {
  const reqData = {
    name: "Progress User",
    studentNumber: "progress123",
  };
  const reqObj = new Request("http://localhost/api/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqData),
  });
  const res = await createUser(reqObj);
  const user = await res.json();
  userId = user.id;
});

app.post("/api/progress/save", async (req, res) => {
  const reqObj = new Request("http://localhost/api/progress/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body),
  });
  const response = await saveProgress(reqObj);
  const data = await response.json();
  res.status(response.status || 200).json(data);
});

app.get("/api/progress/load", async (req, res) => {
  const uid = req.query.userId as string;
  const url = `http://localhost/api/progress/load?userId=${uid}`;
  const reqObj = new Request(url, { method: "GET" });
  const response = await loadProgress(reqObj);
  const data = await response.json();
  res.status(response.status || 200).json(data);
});

describe("User Progress API", () => {
  it("saves progress for a user", async () => {
    const progressPayload = {
      userId,
      currentStage: 2,
      progressData: { solved: [1, 2] },
      timerState: { timeLeft: 120 },
    };
    const response = await request(app)
      .post("/api/progress/save")
      .send(progressPayload);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("userId", userId);
    expect(response.body.currentStage).toBe(2);
  });

  it("loads saved progress for user", async () => {
    const response = await request(app)
      .get(`/api/progress/load?userId=${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("userId", userId);
    expect(response.body.currentStage).toBe(2);
  });

  it("returns 400 if userId missing on load", async () => {
    const response = await request(app)
      .get(`/api/progress/load`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing userId query parameter");
  });
});
