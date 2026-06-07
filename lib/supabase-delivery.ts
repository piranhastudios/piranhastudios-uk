import { createClient } from '@supabase/supabase-js'

const url = process.env.DELIVERY_SUPABASE_URL!
const serviceKey = process.env.DELIVERY_SUPABASE_SERVICE_KEY!

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})
