import { Keyboard } from 'https://deno.land/x/grammy@v1.20.2/mod.ts'

export const mainKeyboardLayout = new Keyboard()
  .text('👾 Save a bunch of urls')
  .resized(true)
  .placeholder('Decide now!')
