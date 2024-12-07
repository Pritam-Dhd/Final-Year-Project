// import express from "express";
// import mongoose from "mongoose";
// // import AdminJSExpress from "@adminjs/express";
// // import adminJs from "./Admin.js";
// import { UserSeeder } from "./Seeder/UserSeeder.js";
// import { RoleSeeder } from "./Seeder/RoleSeeder.js";
// import cors from "cors";
// import UserRoute from "./Routes/User.js";
// import AuthorRoute from "./Routes/Author.js";
// import GenreRoute from "./Routes/Genre.js";
// import PublicationRoute from "./Routes/Publisher.js";
// import BookRoute from "./Routes/Book.js";
// import IssueRoute from "./Routes/Issue.js";
// import FineRoute from "./Routes/Fine.js";
// import EsewaRoute from "./Routes/Esewa.js";
// import DashboardRoute from "./Routes/Dashboard.js";
// import ReportRoute from "./Routes/Report.js";
// import RequestRoute from "./Routes/Request.js";
// import { expiredRequest } from "./Controller/RequestController.js";
// import cookieParser from "cookie-parser";
// import { dirname } from "path";
// import path from "path";
// import { fileURLToPath } from "url";
// import cron from "node-cron";
// import { addFines } from "./Controller/FineController.js";
// import { reminderEmail } from "./Controller/NotificationController.js";
// import { expireToken } from "./Controller/UsersController.js";
// import dotenv from "dotenv";

// const app = express();

// dotenv.config();

// const allowedOrigins = process.env.CORS_ORIGINS
//   ? process.env.CORS_ORIGINS.split(",")
//   : [];

// app.use(cookieParser());
// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   })
// );
// app.use(express.json());

// // Build and use a router to handle AdminJS routes.
// // const router = AdminJSExpress.buildRouter(adminJs); // Create an AdminJS router using your configuration
// // app.use(adminJs.options.rootPath, router); // Use the AdminJS router with the specified root path

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

// app.use(
//   "/",
//   UserRoute,
//   AuthorRoute,
//   GenreRoute,
//   PublicationRoute,
//   BookRoute,
//   IssueRoute,
//   FineRoute,
//   EsewaRoute,
//   DashboardRoute,
//   ReportRoute,
//   RequestRoute
// );

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// app.use("/api/images", express.static(path.join(__dirname, "Pictures")));

// cron.schedule("0 0 * * *", () => {
//   addFines();
//   reminderEmail();
//   expiredRequest();
// });
// cron.schedule("* * * * * *", () => {
//   expireToken();
// });
// // Run the server.
// const run = async () => {
//   // Connect to MongoDB
//   try {
//     await mongoose.connect(process.env.MongoDB);
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error("Error while connecting to MongoDB", error);
//   }
//   UserSeeder();
//   RoleSeeder();
//   addFines();
//   // reminderEmail();
//   expiredRequest();
//   expireToken();
//   // Start the Express server on port 5000 and log a message once it's listening
//   await app.listen(7000, () =>
//     console.log(`Example app listening on port 5000`)
//   );
// };

// run();
