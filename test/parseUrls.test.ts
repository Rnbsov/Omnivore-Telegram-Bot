import { assertEquals } from 'https://deno.land/std@0.218.0/assert/mod.ts'
import { parseUrls } from '../src/utils/parseUrls.ts'

Deno.test('parse urls from string to array', () => {
  const text = `www.sample.com/
  https://omnivore.app/
  https://www.youtube.com/`

  const arrayOfUrls = parseUrls(text)

  assertEquals(arrayOfUrls, [
    'www.sample.com/',
    'https://omnivore.app/',
    'https://www.youtube.com/',
  ])
})
