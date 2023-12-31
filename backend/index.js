import express from "express";
import mongoose from "mongoose";
import AdminJSExpress from "@adminjs/express";
import adminJs from "./Admin.js";
import { UserSeeder } from "./Seeder/UserSeeder.js";
import { RoleSeeder } from "./Seeder/RoleSeeder.js";
import cors from "cors";
import Auth from "./Routes/Auth.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Build and use a router to handle AdminJS routes.
const router = AdminJSExpress.buildRouter(adminJs); // Create an AdminJS router using your configuration
app.use(adminJs.options.rootPath, router); // Use the AdminJS router with the specified root path

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/", Auth);

// Run the server.
const run = async () => {
  // Connect to MongoDB
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/FYP");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error while connecting to MongoDB", error);
  }
  UserSeeder();
  RoleSeeder();
  // Start the Express server on port 5000 and log a message once it's listening
  await app.listen(5000, () =>
    console.log(`Example app listening on port 5000`)
  );
};

run();
