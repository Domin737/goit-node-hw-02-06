const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

describe("Auth Controller - Login", () => {
  let token;
  let userEmail = "example@example.com";
  let userPassword = "testpassword";

  beforeAll(async () => {
    require("dotenv").config({ path: ".env.test" });
    jest.setTimeout(20000);

    await mongoose.connect(process.env.DB_TEST_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const newUser = new User({
      email: userEmail,
      password: userPassword,
      subscription: "starter",
    });
    await newUser.save();

    console.log("Test user created:", newUser);

    token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it("should return status 200 and a token with user object", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: userEmail,
      password: userPassword,
    });

    console.log("Response body:", response.body); // Logowanie odpowiedzi

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toEqual({
      email: userEmail,
      subscription: "starter",
    });
    expect(typeof response.body.user.email).toBe("string");
    expect(typeof response.body.user.subscription).toBe("string");
  });

  it("should return status 401 if email or password is wrong", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "wrong@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.token).not.toBeDefined();
    expect(response.body.message).toBe("Email or password is wrong");
  });
});
