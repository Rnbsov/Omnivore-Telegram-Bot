import { Menu } from 'https://deno.land/x/grammy_menu@v1.2.1/mod.ts'
import { mainKeyboardLayout } from './keyboards.ts'
import { MyContext } from './sessionsHandler.ts'

// Cancel menu button
export const cancelMenu = new Menu<MyContext>('Cancel')
  .text('Cancel', ctx => {
    ctx.reply('canceled 👌', { reply_markup: mainKeyboardLayout })
    ctx.conversation.exit()
  }
  )
  .row()
