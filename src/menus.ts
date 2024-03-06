import { Menu } from 'https://deno.land/x/grammy_menu@v1.2.1/mod.ts'
import { mainKeyboardLayout } from './keyboards.ts'
import { MyContext } from './sessionsHandler.ts'

// Cancel menu button
export const cancelMenu = new Menu<MyContext>('Cancel').text(
  'Cancel',
  ctx => {
    ctx.reply('canceled 👌', { reply_markup: mainKeyboardLayout })
    ctx.conversation.exit()
  }
)

// cancel + reset button for set_default_label command
export const cancelMenuAndResetLabel = new Menu<MyContext>(
  'CancelAndReset'
)
  .addRange(cancelMenu)
  .text('Reset label', ctx => {
    ctx.session.defaultLabel = ''

    ctx.reply('🍃 from now on there is no default label for links')
  })
