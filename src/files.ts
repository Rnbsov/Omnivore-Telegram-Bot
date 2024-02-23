import { Composer } from 'https://deno.land/x/grammy@v1.20.3/mod.ts'
import { MyContext } from './sessionsHandler.ts'

await load({ export: true })

export const fileListener = new Composer<MyContext>()

fileListener.on('message:document', async (ctx, next) => {
  const pdf = ctx.msg.document

  const limit = 10_485_760

  if (pdf.mime_type != 'application/pdf') {
    return await next()
  }
  
  if (pdf.file_size && pdf.file_size > limit) {
    return await ctx.reply('Your file size is exceeding our limit of 10mb 😿')
  }

  const fileId = pdf.file_id
  await ctx.reply(
    'The file identifier of your voice message is: ' + fileId
  )

  const file = await ctx.getFile()
  const path = file.file_path

  const response = await fetch(`https://api.telegram.org/file/bot${Deno.env.get('BOT_TOKEN')}${path}`)
})
