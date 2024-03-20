import { type Filter } from 'https://deno.land/x/grammy@v1.21.1/mod.ts'
import { MyContext } from '../sessionsHandler.ts'
import { getLabels } from "./getLabels.ts";
import { retrieveUrl } from "./retrieveUrl.ts";

export function getUrlAndLabels(ctx: Filter<MyContext, 'message:entities:url'>) {
  // parse url from the message
  const { url, labels: labelsArray } = retrieveUrl(ctx)

  // add default label and source label
  const defaultAndSourceLabels = getLabels(ctx)

  const labels = [...labelsArray, ...defaultAndSourceLabels]

  return { url, labels }
}

