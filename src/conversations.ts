import { type Conversation } from 'https://deno.land/x/grammy_conversations@v1.2.0/mod.ts'
import { MyContext } from './sessionsHandler.ts'
import { mainKeyboardLayout } from './keyboards.ts'
import { OmnivoreApi } from './omnivore/api.ts'
import { parseUrls } from './utils/parseUrls.ts'

type MyConversation = Conversation<MyContext>

export async function askApiKey(
  conversation: MyConversation,
  ctx: MyContext
) {
  await ctx.reply(
    `But before we dive into, I need your help\\. To unlock these amazing features, I'll need your Omnivore API token\\. No need to worry; I'll keep everything super secure\\.

You can generate it by following this guide [Getting an API token](https://docs.omnivore.app/integrations/api.html#getting-an-api-token)

Once you've got it, just send it my way\\. 🚀`,
    {
      parse_mode: 'MarkdownV2',
      reply_markup: { force_reply: true },
    }
  )

  const token = await conversation.form.text()

  conversation.session.apiToken = token

  ctx.reply(
    "Fantastic! Now you're all set to explore Omnivore bot's amazing features. \n\nHow can I assist you today? ✨",
    {
      reply_markup: mainKeyboardLayout,
      parse_mode: 'HTML',
    }
  )
}

export async function saveBunchUrls(
  conversation: MyConversation,
  ctx: MyContext
) {
  const newCtx = await conversation.waitFor('msg:text')
  const urls = newCtx.message?.text

  if (!urls || urls === '') {
    await ctx.reply('No urls provided')
    return
  }

  const urlsArray = parseUrls(urls)

  const token = conversation.session.apiToken

  const api = new OmnivoreApi(token)

  await api.processUrls(urlsArray)
  await ctx.reply(
    `Successfully added ${api.addedEntriesCount} of ${urlsArray.length} links!\nFailed to add ${api.failedEntriesCount} links.`,
    {
      reply_markup: mainKeyboardLayout,
    }
  )
}

export async function updateToken(
  conversation: MyConversation,
  ctx: MyContext
) {
  const newCtx = await conversation.waitFor('msg:text')
  const token = newCtx.message?.text

  conversation.session.apiToken = token || ctx.session.apiToken

  await ctx.reply(`You've Successfully updated the token 🎉`, {
    reply_markup: mainKeyboardLayout,
  })
}
