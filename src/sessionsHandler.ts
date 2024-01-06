import { load } from 'https://deno.land/std@0.211.0/dotenv/mod.ts'
import {
  Context,
  session,
  SessionFlavor,
} from 'https://deno.land/x/grammy@v1.20.2/mod.ts'
import { freeStorage } from 'https://deno.land/x/grammy_storages/free/src/mod.ts'

interface SessionData {
  apiToken: string
}

export type MyContext = Context & SessionFlavor<SessionData>

function initial(): SessionData {
  return {
    apiToken: ''
  }
}

export const sessionHandler = (token: string) => {
  return session({
    initial,
    storage: freeStorage<SessionData>(token),
  })
}
