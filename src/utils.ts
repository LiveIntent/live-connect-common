export const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'

const uuidRegex = new RegExp(`^${UUID}$`, 'i')
const hasTrim = !!String.prototype.trim

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
