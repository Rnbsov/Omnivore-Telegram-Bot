import { load } from 'https://deno.land/std@0.211.0/dotenv/mod.ts'
import { Bot } from 'https://deno.land/x/grammy@v1.20.2/mod.ts'
import { createConversation } from 'https://deno.land/x/grammy_conversations@v1.2.0/conversation.ts'
import { conversations } from 'https://deno.land/x/grammy_conversations@v1.2.0/mod.ts'
import { askApiKey, saveBunchUrls } from './src/conversations.ts'
import { MyContext, sessionHandler } from './src/sessionsHandler.ts'

const env = await load()

const bot = new Bot<MyContext>(env['BOT_TOKEN'])

bot.use(sessionHandler(bot.token))

// conversations
bot.use(conversations())

bot.use(createConversation(askApiKey))
bot.use(createConversation(saveBunchUrls))

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

bot.hears('get', ctx => ctx.reply(ctx.session.apiToken))

bot.hears('👾 Save a bunch of urls', async ctx => {
  await ctx.reply(
    `Send me urls in following format:
  
  url1
  url2
  url3
  
  each on separate line`,
    {
      reply_markup: { force_reply: true },
    }
  )

  await ctx.conversation.enter('saveBunchUrls')
})

bot.start()
