import {
  Context,
  session,
  SessionFlavor,
} from 'https://deno.land/x/grammy@v1.20.2/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@1.24.0'
import { supabaseAdapter } from 'https://deno.land/x/grammy_storages@v2.4.1/supabase/src/mod.ts'
import { load } from 'https://deno.land/std@0.211.0/dotenv/mod.ts'
import { ConversationFlavor } from "https://deno.land/x/grammy_conversations@v1.2.0/conversation.ts";

const env = await load()

const supabase = createClient(
  env['SUPABASE_URL'],
  env['SUPABASE_KEY']
)

const storage = supabaseAdapter({
  supabase,
  table: 'sessions',
})

interface SessionData {
  apiToken: string
  counter: number
}

export type MyContext = Context & SessionFlavor<SessionData> & ConversationFlavor

function initial(): SessionData {
  return {
    apiToken: '',
    counter: 1
  }
}

export const sessionHandler = () => {
  return session({ initial, storage })
}
