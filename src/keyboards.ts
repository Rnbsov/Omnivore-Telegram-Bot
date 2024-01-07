import { Keyboard } from 'https://deno.land/x/grammy@v1.20.3/mod.ts'

export const mainKeyboardLayout = new Keyboard()
  .text('👾 Save a bunch of urls')
  .text('✨ Set new token')
  .resized(true)
  .placeholder('Decide now!')
