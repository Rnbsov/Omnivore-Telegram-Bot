import { type Conversation } from 'https://deno.land/x/grammy_conversations@v1.2.0/mod.ts'
import { MyContext } from './sessionsHandler.ts'
import { mainKeyboardLayout } from "./keyboards.ts";

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

  ctx.session.apiToken = token

  ctx.reply('Fantastic! Now you\'re all set to explore Omnivore bot\'s amazing features. \n\nHow can I assist you today? ✨',
  {
    reply_markup: mainKeyboardLayout,
    parse_mode: 'HTML',
  })
}
