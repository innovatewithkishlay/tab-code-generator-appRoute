import express from "express";
import request from "supertest";
import { POST as saveMessage } from "../../src/app/api/messages/save/route";
import { GET as loadMessages } from "../../src/app/api/messages/load/route";
import { POST as createUser } from "../../src/app/api/user/route";

const app = express();
app.use(express.json());

let userId: number;

// Prepare a user to attach messages to before running tests
beforeAll(async () => {
  const reqBody = {
    name: "Msg User",
    studentNumber: "msg123",
  };
  const reqObj = new Request("http://localhost/api/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqBody),
  });
  const res = await createUser(reqObj);
  const user = await res.json();
  userId = user.id;
});

app.post("/api/messages/save", async (req, res) => {
  const reqObj = new Request("http://localhost/api/messages/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body),
  });
  const response = await saveMessage(reqObj);
  const data = await response.json();
  res.status(response.status || 200).json(data);
});

app.get("/api/messages/load", async (req, res) => {
  const uid = req.query.userId as string;
  const url = `http://localhost/api/messages/load?userId=${uid}`;
  const reqObj = new Request(url, { method: "GET" });
  const response = await loadMessages(reqObj);
  const data = await response.json();
  res.status(response.status || 200).json(data);
});

describe("Messages API", () => {
  it("saves a message for a user", async () => {
    const messagePayload = {
      userId,
      messageText: "This is a hint!",
      messageType: "hint",
      severity: 1,
    };
    const response = await request(app)
      .post("/api/messages/save")
      .send(messagePayload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("userId", userId);
    expect(response.body.messageText).toBe("This is a hint!");
  });

  it("loads saved messages for the user", async () => {
    const response = await request(app)
      .get(`/api/messages/load?userId=${userId}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].userId).toBe(userId);
    expect(["hint", "warning"]).toContain(response.body[0].messageType);
  });

  it("returns 400 if userId missing on load", async () => {
    const response = await request(app)
      .get(`/api/messages/load`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing userId query parameter");
  });
});
