export interface ExternalReadStorageHandler {
  getCookie?: (key: string) => string | null
  getDataFromLocalStorage?: (key: string) => string | null
  localStorageIsEnabled?: () => boolean
}

export interface ExternalStorageHandler extends ExternalReadStorageHandler {
  setCookie?: (key: string, value: string, expires?: Date, sameSite?: string, domain?: string) => void
  setDataInLocalStorage?: (key: string, value: string) => void
  removeDataFromLocalStorage?: (key: string) => void
  findSimilarCookies?: (substring: string) => string[]
}

export interface ExternalCallHandler {
  ajaxGet?: (
    url: string,
    onSuccess: (responseText: string, response?: unknown) => void,
    onError?: (error: unknown) => void,
    timeout?: number
  ) => void
  pixelGet?: (
    url: string,
    onLoad?: () => void
  ) => void
}
