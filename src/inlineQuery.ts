import { Composer } from "https://deno.land/x/grammy@v1.20.3/mod.ts";

export const inlineQuery = new Composer()

inlineQuery.on('inline_query', ctx => {
  const query = ctx.inlineQuery.query
  console.log(query)
})
