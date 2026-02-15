import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

/**
 * Server-only Supabase client using the service role key.
 * Use this in Server Actions and API routes — never import in client components.
 */
export function createServiceClient() {
  return createSupabaseClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
