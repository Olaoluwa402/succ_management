import express, { Application } from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import { IController } from "./utils/interfaces/controller.interface";
import ErrorMiddleware from "./middleware/error.middleware";
import { config, logger } from "./config";

class App {
  public express: Application;
  public port: number;

  constructor(controllers: IController[], PORT: number) {
    this.express = express();
    this.port = PORT;
    this.initialiseMiddleware();
    this.initialiseControllers(controllers);
    // this.initialiseDatabaseConnection();
    this.initialiseErrorHandling();
  }

  private initialiseMiddleware(): void {
    this.express.enable("trust-proxy"); // express behind proxy / trust headers set by our proxy
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(morgan("dev"));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(compression());
  }

  private initialiseDatabaseConnection(): void {
    mongoose
      .connect(config.mongodb.db_url)
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
      });
  }

  private initialiseControllers(controllers: IController[]): void {
    controllers.forEach((controller: IController) => {
      console.log(controller.path, "Router");
      this.express.use("/api", controller.router);
    });
  }

  private initialiseErrorHandling(): void {
    this.express.use(ErrorMiddleware);
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      logger.info(`server running on port ${this.port}`);
      logger.info(`server running on ${config.env} environment`);
    });
  }
}

export default App;
