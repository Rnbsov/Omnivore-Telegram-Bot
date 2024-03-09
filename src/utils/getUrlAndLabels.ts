import { getSourceLabel } from "./getSourceLabel.ts";
import { getDefaultLabel } from "./getDefaultLabel.ts";
import { parseUrls } from "./parseUrls.ts";
import { startsWithUrl } from "./startsWithUrl.ts";
import { Label } from '../types.ts'
import { type Filter } from "https://deno.land/x/grammy@v1.21.1/mod.ts"
import { MyContext } from '../sessionsHandler.ts'

export function getUrlAndLabels(ctx: Filter<MyContext, 'message:entities:url'>) {
  let url, labels: Label[]
  
  // retrieving information from ctx 
  const message = ctx.message.text
  const source = ctx.msg?.forward_origin

  // retrieving information from session 
  const sessionIncludeSource = ctx.session.includeSource
  const sessionDefaultLabel = ctx.session.defaultLabel

  // parse url from the message
  if (startsWithUrl(message)) {
    ({ url, labels } = parseUrls(message)[0]);
  } else {
    // retrieve the first url from the message
    const urlMatch = message.match(/(?:https?:\/\/|www\.)\S+?(?=\s|$)/);
    url = urlMatch ? urlMatch[0] : '';
    labels = [];
  }

  // add default label
  const defaultLabel = getDefaultLabel(sessionDefaultLabel);
  if (defaultLabel.name) {
    labels.push(defaultLabel);
  }

  // add source label if includeSource is true
  if (source && sessionIncludeSource) {
    const sourceLabel = getSourceLabel(source);

    if (sourceLabel) {
      labels.push(sourceLabel);
    }
  }

  return { url, labels };
}
