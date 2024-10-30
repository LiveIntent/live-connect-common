export type Headers = Record<string, string | undefined>

export interface ErrorBus {
  emitErrorWithMessage(name: string, message: string, e?: unknown): this
  emitError(name: string, exception?: unknown): this
}

export interface EventBus extends ErrorBus {
  on<F extends ((event: unknown) => void)>(name: string, callback: F, ctx?: ThisParameterType<F>): this
  once<F extends ((event: unknown) => void)>(name: string, callback: F, ctx?: ThisParameterType<F>): this
  emit(name: string, event: unknown): this
  off(name: string, callback?: (event: unknown) => void): this
}

export interface ReadOnlyStorageHandler {
  getCookie?: (key: string) => string | null
  getDataFromLocalStorage?: (key: string) => string | null
  localStorageIsEnabled?: () => boolean
}

export interface StorageHandler extends ReadOnlyStorageHandler {
  setCookie?: (key: string, value: string, expires?: Date, sameSite?: string, domain?: string) => void
  setDataInLocalStorage?: (key: string, value: string) => void
  removeDataFromLocalStorage?: (key: string) => void
  findSimilarCookies?: (substring: string) => string[]
}

export interface CallHandler {
  ajaxGet?: (
    url: string,
    onSuccess: (responseText: string, response?: unknown) => void,
    onError?: (error: unknown) => void,
    timeout?: number,
    headers?: Headers
  ) => void
  pixelGet?: (
    url: string,
    onLoad?: () => void
  ) => void
}

export interface ErrorDetails extends Error {
  stackTrace?: string
  lineNumber?: number
  columnNumber?: number
  fileName?: string
}
