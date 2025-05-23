import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://libsaoycaasyjpdsxhzv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpYnNhb3ljYWFzeWpwZHN4aHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MTg0NzcsImV4cCI6MjA2MzA5NDQ3N30.2TFpG9cpO3oHLIN7T0b6CA-5asam-zxo_KO96oFa0Nk';

export const supabase = createClient(supabaseUrl, supabaseKey);