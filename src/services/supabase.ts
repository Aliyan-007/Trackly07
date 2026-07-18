import { createClient, type SupabaseClient } from '@supabase/supabase-js';
const url=import.meta.env.VITE_SUPABASE_URL; const key=import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase:SupabaseClient|undefined=url&&key?createClient(url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}):undefined;
export const isSupabaseConfigured=Boolean(supabase);
