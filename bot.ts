import { load } from 'https://deno.land/std@0.211.0/dotenv/mod.ts'
import {
  Bot,
  GrammyError,
  HttpError,
} from 'https://deno.land/x/grammy@v1.21.1/mod.ts'
import { createConversation } from 'https://deno.land/x/grammy_conversations@v1.2.0/conversation.ts'
import { conversations } from 'https://deno.land/x/grammy_conversations@v1.2.0/mod.ts'
import {
  askApiKey,
  saveBunchUrls,
  setDefaultLabel,
  updateToken,
} from './src/conversations.ts'
import { cancelMenu } from './src/menus.ts'
import { OmnivoreApi } from './src/omnivore/api.ts'
import { MyContext, sessionHandler } from './src/sessionsHandler.ts'
import { inlineQuery } from "./src/inlineQuery.ts";
import { fileListener } from "./src/files.ts";
import { slashCommandsListener } from './src/slashCommands.ts'
import { cancelMenuAndResetLabel } from "./src/menus.ts";
import { getUrlAndLabels } from "./src/utils/getUrlAndLabels.ts";
import { includeSourceChoiceMenu } from "./src/menus.ts";
import { Hono } from "https://deno.land/x/hono@v4.0.10/mod.ts"
import { webhookCallback } from "https://deno.land/x/grammy@v1.21.1/mod.ts";

await load({ export: true })


const app = new Hono()
const bot = new Bot<MyContext>(Deno.env.get('BOT_TOKEN') || '')

app.post('/', webhookCallback(bot, 'hono'))

// sessions
bot.use(sessionHandler())

// conversations
bot.use(conversations())

bot.use(createConversation(askApiKey))
bot.use(createConversation(saveBunchUrls))
bot.use(createConversation(updateToken))
bot.use(createConversation(setDefaultLabel))

// Menu
bot.use(cancelMenu)
bot.use(cancelMenuAndResetLabel)
bot.use(includeSourceChoiceMenu)

// inline query
bot.use(inlineQuery)

// file handling
bot.use(fileListener)

// slash commands handler
bot.use(slashCommandsListener)

// handlers
bot.on('message:entities:url', async ctx => {
  // retrieve stuff from session
  const token = ctx.session.apiToken
  const api = new OmnivoreApi(token)

  const {url, labels} = getUrlAndLabels(ctx)

  await api.saveUrl(url, labels)

  const feedback = api.addedEntriesCount === 1
    ? 'Successfully added link to Omnivore! 😸👍'
    : 'Failed to add the link. 😿'

    await ctx.reply(feedback)
})

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
