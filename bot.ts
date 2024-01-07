import { load } from 'https://deno.land/std@0.211.0/dotenv/mod.ts'
import { Bot } from 'https://deno.land/x/grammy@v1.20.3/mod.ts'
import { createConversation } from 'https://deno.land/x/grammy_conversations@v1.2.0/conversation.ts'
import { conversations } from 'https://deno.land/x/grammy_conversations@v1.2.0/mod.ts'
import {
  askApiKey,
  saveBunchUrls,
  updateToken,
} from './src/conversations.ts'
import { MyContext, sessionHandler } from './src/sessionsHandler.ts'
import { cancelMenu } from './src/menus.ts'

await load({ export: true })

const bot = new Bot<MyContext>(Deno.env.get('BOT_TOKEN') || '')

bot.use(sessionHandler())

// conversations
bot.use(conversations())

bot.use(createConversation(askApiKey))
bot.use(createConversation(saveBunchUrls))
bot.use(createConversation(updateToken))

// Menu
bot.use(cancelMenu)

bot.hears('err', ctx =>
  ctx.reply('bla', {
    reply_markup: cancelMenu,
  })
)

// handlers
bot.command('start', async ctx => {
  await ctx.reply(
    "Hey there! I'm your ultimate bot for all Omnivore things. 🌟 \n\n<b>👾 Save a bunch</b> - allows you to save a bunch of urls at once \n\nTo unlock these features, I'll need an API token. \nDon't worry, your information is handled securely.",
    {
      parse_mode: 'HTML',
    }
  )

  await ctx.conversation.enter('askApiKey')
})

bot.hears('👾 Save a bunch of urls', async ctx => {
  await ctx.reply(
    `Send me urls in following format:
  
  url1
  url2
  url3
  
  each on separate line`,
    {
      reply_markup: cancelMenu,
    }
  )

  await ctx.conversation.enter('saveBunchUrls')
})

bot.hears('✨ Set new token', async ctx => {
  await ctx.reply(
    `Okay, just send me the new one
    
You can get new by following this guide [Getting an API token](https://docs.omnivore.app/integrations/api.html#getting-an-api-token)`,
    {
      parse_mode: 'MarkdownV2',
      reply_markup: cancelMenu,
    }
  )

  await ctx.conversation.enter('updateToken')
})

bot.start()
