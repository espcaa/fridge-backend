import { Elysia } from "elysia";
import { supabasePlugin } from "../plugins/supabase";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(supabasePlugin)
  .post("signupWithPassword", async ({ body, supabase }) => {
    const { email, password } = body as {
      email: string;
      password: string;
    };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        message: "Failed to sign up",
        error: error.message,
      };
    }

    return {
      success: true,
      message: "User signed up successfully",
      error: null,
    };
  })
  .post("loginWithPassword", async ({ body, supabase }) => {
    const { email, password } = body as {
      email: string;
      password: string;
    };

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        message: "Failed to log in",
        error: error.message,
      };
    }

    return {
      success: true,
      message: "User logged in successfully",
      data,
    };
  });
