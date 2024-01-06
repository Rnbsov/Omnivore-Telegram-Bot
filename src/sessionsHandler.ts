import {
  Context,
  session,
  SessionFlavor,
} from 'https://deno.land/x/grammy@v1.20.2/mod.ts'

interface SessionData {
  apiToken: string
}

export type MyContext = Context & SessionFlavor<SessionData>

function initial(): SessionData {
  return {
    apiToken: '',
  }
}

export const sessionHandler = () => {
  return session({ initial })
}
