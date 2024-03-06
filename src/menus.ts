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

export const includeSourceChoiceMenu = new Menu<MyContext>(
  'includeSourceChoiceMenu'
)
  .text('yes', ctx => {
    ctx.session.includeSource = true
    
    ctx.reply(`Now your links sended to me, will include the source where they came from 😸👍`, {
      reply_markup: mainKeyboardLayout,
    })
  })
  .text('no', ctx => {
    ctx.session.includeSource = false

    ctx.reply(`Your links won't include the source, and that's absolutely normal 😸👍`, {
      reply_markup: mainKeyboardLayout,
    })
  })
