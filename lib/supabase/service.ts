import { createClient } from '@supabase/supabase-js';

const serviceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceUrl || !serviceKey) {
  throw new Error('Supabase service configuration missing (URL or SERVICE_ROLE_KEY).');
}

export const supabaseService = createClient(serviceUrl, serviceKey, {
  auth: {
    persistSession: false,
  },
});
