import { createClient } from "@supabase/supabase-js";
import Elysia from "elysia";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
);

export const supabasePlugin = new Elysia().decorate("supabase", supabase);
