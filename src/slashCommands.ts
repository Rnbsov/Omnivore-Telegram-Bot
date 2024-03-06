import { Composer } from 'https://deno.land/x/grammy@v1.20.3/mod.ts'
import { MyContext } from './sessionsHandler.ts'
import { cancelMenuAndResetLabel } from "./menus.ts";

export const slashCommandsListener = new Composer<MyContext>()

slashCommandsListener.hears('/set_default_label', async ctx => {
  ctx.reply(
    'Send the label you want to be added for all of the links you send me',
    {
      reply_markup: cancelMenuAndResetLabel,
    }
  )

  await ctx.conversation.enter('setDefaultLabel')
})
