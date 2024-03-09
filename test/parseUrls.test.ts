import { assertEquals } from 'https://deno.land/std@0.218.0/assert/mod.ts'
import { parseUrls } from '../src/utils/parseUrls.ts'

Deno.test('parse urls from string to array', () => {
  const text = `www.sample.com/ fruits science
  https://omnivore.app/ productivity
  https://www.youtube.com/`

  const arrayOfUrls = parseUrls(text)

  assertEquals(arrayOfUrls, [
    { url: 'www.sample.com/', labels: [ { name: 'fruits' }, { name: 'science' } ] },
    { url: 'https://omnivore.app/', labels: [ { name: 'productivity' } ] },
    { url: 'https://www.youtube.com/', labels: [] }
  ])
})
