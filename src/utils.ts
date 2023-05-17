import { ErrorDetails } from './types'

export const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'

const uuidRegex = new RegExp(`^${UUID}$`, 'i')
const hasTrim = !!String.prototype.trim

export const safeToString = (value: unknown): string => typeof value === 'object' ? JSON.stringify(value) : ('' + value)

export const nonNull = <A>(value: A): value is NonNullable<A> => value != null

export const isNonEmpty = <A>(value: A): value is NonNullable<A> => nonNull(value) && trim(value).length > 0

export const isUUID = (value: unknown): value is string => !!value && uuidRegex.test(trim(value))

export const isArray = (arr: unknown): arr is unknown[] => Object.prototype.toString.call(arr) === '[object Array]'

export const trim = (value: unknown): string => hasTrim ? ('' + value).trim() : ('' + value).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')

export const isString = (str: unknown): str is string => typeof str === 'string'

export const strEqualsIgnoreCase = (fistStr: unknown, secondStr: unknown): boolean =>
  isString(fistStr) && isString(secondStr) && trim(fistStr.toLowerCase()) === trim(secondStr.toLowerCase())

export const isObject = (obj: unknown): obj is object => !!obj && typeof obj === 'object' && !isArray(obj)

export const isRecord = (obj: unknown): obj is Record<string | symbol | number, unknown> => isObject(obj)

export const isFunction = (fun: unknown): fun is CallableFunction => !!fun && typeof fun === 'function'

const _expiresIn = (expires: number, number: number): Date => new Date((new Date().getTime() + (expires * number)))

export const expiresInDays = (expires: number): Date => _expiresIn(expires, 864e5)

export const expiresInHours = (expires: number): Date => _expiresIn(expires, 36e5)

export const wrapError = (name: string, e?: unknown, message?: string): ErrorDetails => {
  if (isObject(e)) {
    let error: ErrorDetails
    if ('message' in e && typeof e.message === 'string') {
      error = new Error(message || e.message)
    } else {
      error = new Error(message)
    }

    error.name = name

    if ('stack' in e && typeof e.stack === 'string') {
      error.stack = e.stack
    }
    if ('lineNumber' in e && typeof e.lineNumber === 'number') {
      error.lineNumber = e.lineNumber
    }
    if ('columnNumber' in e && typeof e.columnNumber === 'number') {
      error.columnNumber = e.columnNumber
    }
    return error
  } else {
    const error = Error(message)
    error.name = name
    return error
  }
}
