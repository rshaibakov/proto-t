import { createClient } from '@supabase/supabase-js'

export const api = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY)
