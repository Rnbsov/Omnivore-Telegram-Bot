import { load } from 'https://deno.land/std@0.211.0/dotenv/mod.ts'
import { Bot } from 'https://deno.land/x/grammy@v1.20.2/mod.ts'
import { mainKeyboardLayout } from './src/keyboards.ts'
import { MyContext, sessionHandler } from "./src/sessionsHandler.ts";

const env = await load()

const bot = new Bot<MyContext>(env['BOT_TOKEN'])

bot.use(sessionHandler())

bot.command('start', ctx =>
  ctx.reply(
    'Welcome! Up and running. \n\n<b>👾 Save a bunch</b> - allows you to save a bunch of urls at once',
    {
      reply_markup: mainKeyboardLayout,
      parse_mode: "HTML"
    }
  )
)

bot.hears('👾 Save a bunch of urls', ctx => {
  
  ctx.reply(`Send me urls in following format:
  
  url1
  url2
  url3
  
  each on separate line`)
})

bot.start()
