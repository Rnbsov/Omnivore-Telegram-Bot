export type Label = {
  name: string
}

export type UrlInfo = {
  url: string
  labels: Label[]
}


export type ProcessUrlsParams = {
  urls: UrlInfo[];
  additionalLabels?: Label[];
  startIndex?: number;
};
