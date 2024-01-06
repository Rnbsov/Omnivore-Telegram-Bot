import {
  Context,
  session,
  SessionFlavor,
} from 'https://deno.land/x/grammy@v1.20.2/mod.ts'
import { ConversationFlavor } from "https://deno.land/x/grammy_conversations@v1.2.0/conversation.ts";
import { freeStorage } from 'https://deno.land/x/grammy_storages/free/src/mod.ts'

interface SessionData {
  apiToken: string
}

export type MyContext = Context & SessionFlavor<SessionData> & ConversationFlavor

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
