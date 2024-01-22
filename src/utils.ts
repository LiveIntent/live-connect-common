import { ErrorDetails } from './types'

export const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'

const uuidRegex = new RegExp(`^${UUID}$`, 'i')
const hasTrim = !!String.prototype.trim

export function onNonNull<A, B>(value: A, fn: (value: NonNullable<A>) => B): null | undefined | B {
  return value != null ? fn(value) : (value as null | undefined)
}

export function safeToString(value: unknown): string {
  return typeof value === 'object' ? JSON.stringify(value) : ('' + value)
}

export function nonNull<A>(value: A): value is NonNullable<A> {
  return value != null
}

export function isNonEmpty<A>(value: A): value is NonNullable<A> {
  return nonNull(value) && trim(value).length > 0
}

export function isUUID(value: unknown): value is string {
  return !!value && uuidRegex.test(trim(value))
}

export function isArray(arr: unknown): arr is unknown[] {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

export function trim(value: unknown): string {
  return hasTrim ? ('' + value).trim() : ('' + value).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
}

export function isString(str: unknown): str is string {
  return typeof str === 'string'
}

export function strEqualsIgnoreCase(fistStr: unknown, secondStr: unknown): boolean {
  return isString(fistStr) && isString(secondStr) && trim(fistStr.toLowerCase()) === trim(secondStr.toLowerCase())
}

export function isObject(obj: unknown): obj is object {
  return !!obj && typeof obj === 'object' && !isArray(obj)
}

export function isRecord(obj: unknown): obj is Record<string | symbol | number, unknown> {
  return isObject(obj)
}

export function isFunction(fun: unknown): fun is CallableFunction {
  return !!fun && typeof fun === 'function'
}

function _expiresIn(expires: number, number: number): Date {
  return new Date((new Date().getTime() + (expires * number)))
}

export function expiresInDays(expires: number): Date {
  return _expiresIn(expires, 864e5)
}

export function expiresInHours(expires: number): Date {
  return _expiresIn(expires, 36e5)
}

export function wrapError(name: string, e?: unknown, message?: string): ErrorDetails {
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
