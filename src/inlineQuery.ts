import { Composer } from 'https://deno.land/x/grammy@v1.21.1/mod.ts'
import { OmnivoreApi } from './omnivore/api.ts'
import { MyContext } from './sessionsHandler.ts'

export const inlineQuery = new Composer<MyContext>()

inlineQuery.on('inline_query', async ctx => {
  const query = ctx.inlineQuery.query
  const token = ctx.session.apiToken

  const api = new OmnivoreApi(token)

  const offset = ctx.inlineQuery.offset || ''

  const { results, nextOffset } = await api.search(query, offset)

  await ctx.answerInlineQuery(results, {
    cache_time: 300,
    next_offset: nextOffset,
  })
})
