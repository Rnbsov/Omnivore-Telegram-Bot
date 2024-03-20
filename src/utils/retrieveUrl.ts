import { parseUrls } from './parseUrls.ts';
import { startsWithUrl } from './startsWithUrl.ts';
import { Label } from '../types.ts';
import { type Filter } from 'https://deno.land/x/grammy@v1.21.1/mod.ts';
import { MyContext } from '../sessionsHandler.ts';

export function retrieveUrl(ctx: Filter<MyContext, 'message:entities:url'>) {
  const message = ctx.message.text;

  let url: string = '';
  let labels: Label[] = [];

  if (startsWithUrl(message)) {
    ; ({ url, labels } = parseUrls(message)[0]);
  } else if (ctx.entities('text_link').length > 0) {
    // handle case when user sends a message with text formatted link
    const linkEntity = ctx.entities('text_link')[0];
    if (linkEntity && linkEntity.url) {
      url = linkEntity.url;
    }
  } else {
    // retrieve the first url from the message/post
    const urlEntity = ctx.entities('url')[0];
    if (urlEntity && urlEntity.text) {
      url = urlEntity.text;
    }
  }

  return { url, labels };
}
