import { Elysia } from "elysia";
import { houseRoutes } from "../routes/house";
import { authRoutes } from "../routes/auth";

const app = new Elysia()
  .get("/", () => "The fridge is busy...")
  .listen(3000)
  .use(houseRoutes)
  .use(authRoutes);

console.log(
  `The fridge became alive at ${app.server?.hostname}:${app.server?.port}...`,
);
