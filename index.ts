import http from "http";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import socket from "./socket.ts";

dotenv.config();
const app: express.Application = express();
const server: http.Server = http.createServer(app);

app.use(express.static("public"));
app.get("/", (request: express.Request, response: express.Response) => {
  response.sendFile(path.resolve("index.html"));
});

socket(server);

server.listen(process.env.PORT, () => {
  const isProduction = process.env.PRODUCTION === "true";
  console.log(process.env.PRODUCTION);

  console.log(`Server is running on ${isProduction ? "production" : "development"} environment`);
  console.log(`Server is running on URL [http://localhost:${process.env.PORT}]`);
  console.log(
    `Server is listening from client URL ${
      isProduction ? `[${process.env.PRODUCTION_URL}]` : `[${process.env.DEVELOPMENT_URL}]`
    }`
  );
});
