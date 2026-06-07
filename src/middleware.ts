import express, { type Request, type Response, type NextFunction } from "express";
import morgan from "morgan";

export const server = express();

server.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(morgan("dev"));
