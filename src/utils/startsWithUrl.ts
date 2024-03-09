export function startsWithUrl(text: string) {
  const urlPattern = /^\s*(http[s]?:\/\/|www\.)\S/;

  return urlPattern.test(text);
}
