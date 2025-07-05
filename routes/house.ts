import { Elysia } from "elysia";
import { supabasePlugin } from "../plugins/supabase";

export const houseRoutes = new Elysia({ prefix: "/house" })
  .use(supabasePlugin)
  .post("/createHouse", async ({ body, supabase }) => {
    const { name, description, token } = body as {
      name: string;
      description: string;
      token: string;
    };

    let userId = "";

    // Check the user exists
    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) {
        return {
          success: false,
          message: "Invalid token or user not found",
          error: error ? error.message : "User not found",
        };
      } else {
        userId = data.user.id;
      }
    } catch (error) {
      return {
        success: false,
        message: "Failed to verify user",
        error: (error as Error).message,
      };
    }

    // Add the house to the database

    const { data, error } = await supabase.from("houses").insert({
      name,
      description,
      created_by: userId,
    });

    if (error) {
      return {
        success: false,
        message: "Failed to create house",
        error: error.message,
      };
    }

    return {
      message: `House '${name}' created with description: ${description}`,
      success: true,
      data,
    };
  });
