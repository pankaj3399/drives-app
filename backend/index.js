const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const routes = require("./routes");
const connectToDatabase = require("./internal/db.init");
const projectConfig = require("./config");
const startingMiddleware = require("./middlewares/starting.middleware");
const scheduleCron = require("./utils/cron-job");

const bootstrap = async () => {
  const app = express();

  startingMiddleware(app);
  await connectToDatabase();
  scheduleCron();

  // Set trust proxy to enable 'X-Forwarded-For' header
  app.set("trust proxy", true);

  // Use the main router
  app.use(routes);
  app.get("/", (req, res) => {
    res.set("Content-Type", "application/json");
    res.send({ content: "Hello, world!" });
  });
  // unexpected  router hit shows error
  app.all("*", (req, res, next) => {
    next(
      res
        .status(404)
        .json({ err: `Can't find ${req.originalUrl} on this server!` })
    );
  });

  // listen port
  app.listen(projectConfig.app.port, () => {
    console.log(`Server is running at ${projectConfig.app.port}`);
  });

  // Error handle
  process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
  });

  process.on("SIGTERM", () => {
    console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  });
  process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
  });
};

(async () => {
  await bootstrap();
})();
