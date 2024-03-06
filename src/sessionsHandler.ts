import {
  Context,
  session,
  SessionFlavor,
} from 'https://deno.land/x/grammy@v1.20.3/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.33.1'
import { supabaseAdapter } from 'https://deno.land/x/grammy_storages@v2.4.1/supabase/src/mod.ts'
import { load } from 'https://deno.land/std@0.211.0/dotenv/mod.ts'
import { ConversationFlavor } from 'https://deno.land/x/grammy_conversations@v1.2.0/conversation.ts'

await load({ export: true })

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_KEY') || ''
)

const storage = supabaseAdapter({
  supabase,
  table: 'sessions',
})

interface SessionData {
  apiToken: string
  defaultLabel: string
}

export type MyContext = Context &
  SessionFlavor<SessionData> &
  ConversationFlavor

function initial(): SessionData {
  return {
    apiToken: '',
    defaultLabel: ''
  }
}

function getSessionKey(ctx: Context): string | undefined {
  return ctx.from?.id.toString()
}

export const sessionHandler = () => {
  return session({ initial, storage, getSessionKey })
}
