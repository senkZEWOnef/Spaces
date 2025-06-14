// lib/supabase.ts
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

const supabaseUrl = "https://bqcywlldyzdydizdxyrd.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxY3l3bGxkeXpkeWRpemR4eXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NDE3ODgsImV4cCI6MjA2NDIxNzc4OH0.MJt4qQSg_0hvEiP2zTHiSJIJxKBYrwvA-AA1-PCgOeg";

export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);
