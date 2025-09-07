import express from "express";
import request from "supertest";
import { POST as saveTestResult } from "../../src/app/api/test-results/save/route";
import { GET as loadTestResults } from "../../src/app/api/test-results/load/route";
import { POST as createUser } from "../../src/app/api/user/route";

const app = express();
app.use(express.json());

let userId: number;

// Create a user before running tests to link test results to
beforeAll(async () => {
  const userPayload = {
    name: "TR User",
    studentNumber: "tr123",
  };
  const reqObj = new Request("http://localhost/api/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userPayload),
  });
  const res = await createUser(reqObj);
  const user = await res.json();
  userId = user.id;
});

app.post("/api/test-results/save", async (req, res) => {
  const reqObj = new Request("http://localhost/api/test-results/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body),
  });
  const response = await saveTestResult(reqObj);
  const data = await response.json();
  res.status(response.status || 200).json(data);
});

app.get("/api/test-results/load", async (req, res) => {
  const uid = req.query.userId as string;
  const url = `http://localhost/api/test-results/load?userId=${uid}`;
  const reqObj = new Request(url, { method: "GET" });
  const response = await loadTestResults(reqObj);
  const data = await response.json();
  res.status(response.status || 200).json(data);
});

describe("Test Results API", () => {
  it("saves a test result for a user and stage", async () => {
    const testResultPayload = {
      userId,
      stage: 1,
      resultStatus: "pass",
      details: { output: "Success", score: 100 },
    };
    const response = await request(app)
      .post("/api/test-results/save")
      .send(testResultPayload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("userId", userId);
    expect(response.body.stage).toBe(1);
    expect(response.body.resultStatus).toBe("pass");
  });

  it("loads all test results for the user", async () => {
    const response = await request(app)
      .get(`/api/test-results/load?userId=${userId}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].userId).toBe(userId);
  });

  it("returns 400 if userId missing on load", async () => {
    const response = await request(app).get(`/api/test-results/load`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing userId query parameter");
  });
});
