import express from "express";
import mongoose from "mongoose";
import AdminJSExpress from "@adminjs/express";
import adminJs from "./Admin.js";
import { UserSeeder } from "./Seeder/UserSeeder.js";
import { RoleSeeder } from "./Seeder/RoleSeeder.js";
import cors from "cors";
import UserRoute from "./Routes/User.js";
import AuthorRoute from "./Routes/Author.js";
import GenreRoute from "./Routes/Genre.js";
import PublicationRoute from "./Routes/Publisher.js";
import cookieParser from "cookie-parser";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3002"],
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

app.use("/", UserRoute, AuthorRoute, GenreRoute, PublicationRoute);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use("/api/images", express.static(path.join(__dirname, "Pictures")));

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
