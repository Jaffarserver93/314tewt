
import { createClient } from '@supabase/supabase-js';

export async function createSupabaseServerClient(admin = false) {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        admin ? process.env.SUPABASE_SERVICE_KEY! : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}
