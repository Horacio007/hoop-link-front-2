export interface IResponseError {
  headers:    Headers;
  status:     number;
  statusText: string;
  url:        string;
  ok:         boolean;
  name:       string;
  message:    string;
  error:      Error;
}

export interface Error {
  message:    string;
  error:      string;
  statusCode: number;
}

export interface Headers {
  normalizedNames: NormalizedNames;
  lazyUpdate:      null;
}

export interface NormalizedNames {
}
