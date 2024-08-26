const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn().mockResolvedValue(true),
}));

describe("Auth Controller", () => {
  let token;
  let userEmail = "example@example.com";
  let userPassword = "testpassword";
  let userId;

  beforeAll(async () => {
    require("dotenv").config({ path: ".env.test" });
    jest.setTimeout(20000);

    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    await mongoose.connect(process.env.DB_TEST_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const newUser = new User({
      email: userEmail,
      password: userPassword,
      subscription: "starter",
      verify: true,
    });
    await newUser.save();
    userId = newUser._id;

    console.log("Test user created:", newUser);

    token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    
    console.log("Generated token:", token);

    // Update user with token
    await User.findByIdAndUpdate(userId, { token });

    const updatedUser = await User.findById(userId);
    console.log("Updated user:", updatedUser);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe("Login", () => {
    it("should return status 200 and a token with user object", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: userEmail,
        password: userPassword,
      });

      console.log("Login response body:", response.body);

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toEqual({
        email: userEmail,
        subscription: "starter",
      });
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

  describe("Register", () => {
    it("should register a new user and return status 201", async () => {
      const newUser = {
        email: "newuser@example.com",
        password: "newpassword",
      };

      const response = await request(app).post("/api/users/signup").send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe(newUser.email);
      expect(response.body.user.subscription).toBe("starter");
      expect(response.body.message).toBe("User created successfully");
    });

    it("should return status 409 if user already exists", async () => {
      const existingUser = {
        email: userEmail,
        password: "somepassword",
      };

      const response = await request(app).post("/api/users/signup").send(existingUser);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe("Email in use");
    });
  });

  describe("Logout", () => {
    it("should logout user and return status 204", async () => {
      const response = await request(app)
        .post("/api/users/logout")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);
    });

    it("should return status 401 if token is invalid", async () => {
      const response = await request(app)
        .post("/api/users/logout")
        .set("Authorization", "Bearer invalidtoken");

      expect(response.status).toBe(401);
    });
  });

  describe("Current User", () => {
    it("should return current user information", async () => {
      console.log("Token used for current user test:", token);
      const response = await request(app)
        .get("/api/users/current")
        .set("Authorization", `Bearer ${token}`);

      console.log("Current user response:", response.body);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe(userEmail);
      expect(response.body.subscription).toBe("starter");
    });

    it("should return status 401 if token is invalid", async () => {
      const response = await request(app)
        .get("/api/users/current")
        .set("Authorization", "Bearer invalidtoken");

      expect(response.status).toBe(401);
    });
  });
});
