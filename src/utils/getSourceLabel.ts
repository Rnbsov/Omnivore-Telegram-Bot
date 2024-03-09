import { MessageOrigin } from "https://deno.land/x/grammy_types@v3.4.6/message.ts";

export function getSourceLabel(source: MessageOrigin) {
  let sourceLabel = { name: '' }
  
  if (source) {
    switch (source.type) {
      case 'user':
        sourceLabel = { name: `${source.sender_user.first_name} ${source.sender_user.last_name}` }
        break;
      case 'hidden_user':
        sourceLabel = { name: source.sender_user_name } 
        break
      case 'channel':
        sourceLabel = { name: source.chat.title } 
        break
      case 'chat':
        sourceLabel = { name: source.author_signature || '' } 
        break
    }

    return sourceLabel
  }
}
