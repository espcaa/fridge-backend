import { Elysia } from "elysia";
import { houseRoutes } from "../routes/house";

// get the port from .env

const PORT = process.env.PORT || 3000;

const app = new Elysia()
  .get("/", () => "The fridge is busy...")
  .listen(PORT)
  .use(houseRoutes);

console.log(
  `The fridge became alive at ${app.server?.hostname}:${app.server?.port}...`,
);
