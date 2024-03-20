import { type Conversation } from 'https://deno.land/x/grammy_conversations@v1.2.0/mod.ts'
import { MyContext } from './sessionsHandler.ts'
import { mainKeyboardLayout } from './keyboards.ts'
import { OmnivoreApi } from './omnivore/api.ts'
import { parseUrls } from './utils/parseUrls.ts'
import { Label } from "./types.ts";
import { getLabels } from "./utils/getLabels.ts";

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

  await api.processUrls({urls: urlsArray})
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

export async function setDefaultLabel(
  conversation: MyConversation,
  ctx: MyContext
) {
  const newCtx = await conversation.waitFor('msg:text')
  const label = newCtx.message?.text

  conversation.session.defaultLabel = label || ctx.session.defaultLabel

  await ctx.reply(`You've Successfully set the label ${label} 🎉`, {
    reply_markup: mainKeyboardLayout,
  })
}

export async function forwardPostLabels(
  conversation: MyConversation,
  ctx: MyContext
) {
  const userLabels = (ctx.message?.text || '').trim().split(/\s+/).map(label => ({ name: label }))

  const token = conversation.session.apiToken
  
  const api = new OmnivoreApi(token)

  const urlInput = await conversation.waitFor('message:entities:url')
  let url = ''
  console.log(urlInput)
  if (urlInput.entities('text_link').length > 0) {
    // handle case when user sends a message with text formatted link
    const linkEntity = urlInput.entities('text_link')[0];
    if (linkEntity && linkEntity.url) {
      url = linkEntity.url;
    }
  } else {
    // retrieve the first url from the message/post
    const urlEntity = urlInput.entities('url')[0];
    if (urlEntity && urlEntity.text) {
      url = urlEntity.text;
    }
  }
  
  const defaultLabels = getLabels(urlInput)
  const labels: Label[] = [...userLabels, ...defaultLabels] 
  
  api.saveUrl(url, labels)

  await ctx.reply('Successfully added link to Omnivore! 😸👍', {
    reply_markup: mainKeyboardLayout,
  })
}
