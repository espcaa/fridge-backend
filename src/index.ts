import { Elysia } from "elysia";
import { houseRoutes } from "../routes/house";
import { authRoutes } from "../routes/auth";

// get the port from .env

const PORT = process.env.PORT || 3000;

const app = new Elysia()
  .get("/", () => "The fridge is busy...")
  .listen(PORT)
  .use(houseRoutes)
  .use(authRoutes);

console.log(
  `The fridge became alive at ${app.server?.hostname}:${app.server?.port}...`,
);
