import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "../utils/config";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cWNwcGtwdGhxd3ZleGRzaG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgzNTk4NDAsImV4cCI6MjAxMzkzNTg0MH0.u4NWEYs2-gd_gU56ueZNtNXYzFjspHpLzdRgTNwrGUE";
const supabase = createClient(SUPABASE_URL, supabaseKey);

export default supabase;
