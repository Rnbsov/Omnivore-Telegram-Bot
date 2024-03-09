import { getSourceLabel } from "./getSourceLabel.ts";
import { getDefaultLabel } from "./getDefaultLabel.ts";
import { parseUrls } from "./parseUrls.ts";
import { startsWithUrl } from "./startsWithUrl.ts";
import { Label } from '../types.ts'
import { MessageOrigin } from "https://deno.land/x/grammy_types@v3.4.6/message.ts";

export function getUrlAndLabels(message: string, source: MessageOrigin | undefined, sessionIncludeSource: boolean, sessionDefaultLabel: string) {
  let url, labels: Label[]

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
