import { Composer } from 'https://deno.land/x/grammy@v1.20.3/mod.ts'
import { MyContext } from './sessionsHandler.ts'
import { OmnivoreApi } from './omnivore/api.ts'

export const fileListener = new Composer<MyContext>()

fileListener.on('message:document', async (ctx, next) => {
  try {

    ctx.reply('Started processing your file')
    
    const file = ctx.msg.document
    const fileType = file.mime_type
    const fileSize = file.file_size

    const limit = 10_485_760

    if (fileType != 'application/pdf') {
      return await next()
    }

    if (fileSize && fileSize > limit) {
      return await ctx.reply(
        'Your file size is exceeding our limit of 10mb 😿'
      )
    }

    const fileInfo = await ctx.getFile()

    const token = ctx.session.apiToken
    const api = new OmnivoreApi(token)

    await api.uploadFile(fileInfo, fileType)

    ctx.reply(`File successfully uploaded`)
  } catch (error) {
    console.log(error)
    ctx.reply('Something went wrong, please try again after a while')
  }
})
