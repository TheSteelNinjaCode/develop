// src/test/__tests__/user.test.ts
import request from "supertest";
import app from "../";

describe("User Router", () => {
  it("should create a user", async () => {
    const response = await request(app)
      .post("/trpc/user.create") // Use the correct path and procedure name
      .send({
        name: "John Doe test",
        email: "john@example.com",
        password: "yourPassword",
      }); // Adjust the payload as necessary

    expect(response.status).toBe(200);

    // Adjusted to check for the id property within the nested structure
    expect(response.body.result.data).toHaveProperty("id");
  });

  // Add more tests as needed
});
