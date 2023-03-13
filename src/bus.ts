import { ERRORS_CHANNEL, GLOBAL_BUS } from './consts'
import { EventBus } from './types'
import { isFunction, wrapError } from './utils'

export function localBus(replaySize?: number | string): EventBus {
  return new ReplayEmitter(replaySize)
}

export function windowAttachedBus(name: string, replaySize?: number | string, errorCallback?: (error: unknown) => void): EventBus | undefined {
  function extendBusIfNeeded(bus: EventBus) {
    if (isFunction(bus.emitErrorWithMessage) && isFunction(bus.emitError)) {
      return
    }

    bus.emitErrorWithMessage = function (name, message, e = {}) {
      const wrappedError = wrapError(name, e, message)
      return bus.emit(ERRORS_CHANNEL, wrappedError)
    }

    bus.emitError = function (name, exception) {
      const wrappedError = wrapError(name, exception)
      return bus.emit(ERRORS_CHANNEL, wrappedError)
    }
  }

  try {
    if (!window && isFunction(errorCallback)) {
      errorCallback(new Error('Bus can only be attached to the window, which is not present'))
    }
    if (window && !(name in window)) {
      window[name] = localBus(replaySize)
    }
    const existingBus = window[name] as EventBus
    extendBusIfNeeded(existingBus)
    return existingBus
  } catch (e) {
    console.error('events.bus.init', e)
    if (isFunction(errorCallback)) errorCallback(e)
  }
}

export function getGlobalBus(replaySize?: number | string, errorCallback?: (error: unknown) => void): EventBus | undefined {
  return windowAttachedBus(GLOBAL_BUS, replaySize, errorCallback)
}

interface EventHandler {
  callback: (data: unknown) => void
  unbound: (data: unknown) => void
}

export class ReplayEmitter implements EventBus {
  private h: Record<string, EventHandler[]>
  private q: Record<string, unknown[]>
  size: number

  constructor (replaySize?: number | string) {
    this.size = 5

    if (typeof replaySize === 'number') {
      this.size = replaySize
    } else if (typeof replaySize === 'string') {
      this.size = parseInt(replaySize) || this.size
    }

    this.h = {}
    this.q = {}
  }

  on<F extends ((event: unknown) => void)>(name: string, callback: F, ctx?: ThisParameterType<F>): this {
    const handler: EventHandler = {
      callback: callback.bind(ctx),
      unbound: callback
    };

    (this.h[name] || (this.h[name] = [])).push(handler)

    const eventQueueLen = (this.q[name] || []).length
    for (let i = 0; i < eventQueueLen; i++) {
      callback.call(ctx, this.q[name][i])
    }

    return this
  }

  once<F extends ((event: unknown) => void)>(name: string, callback: F, ctx?: ThisParameterType<F>): this {
    const eventQueue = this.q[name] || []
    if (eventQueue.length > 0) {
      callback.call(ctx, eventQueue[0])
      return this
    } else {
      const listener = (args: unknown) => {
        this.off(name, listener)
        callback.call(ctx, args)
      }

      listener._ = callback
      return this.on(name, listener, ctx)
    }
  }

  emit(name: string, event: unknown): this {
    const evtArr = (this.h[name] || []).slice()
    let i = 0
    const len = evtArr.length

    for (i; i < len; i++) {
      evtArr[i].callback(event)
    }

    const eventQueue = this.q[name] || (this.q[name] = [])
    if (eventQueue.length >= this.size) {
      eventQueue.shift()
    }
    eventQueue.push(event)

    return this
  }

  off(name: string, callback: (event: unknown) => void): this {
    const handlers = this.h[name]
    const liveEvents = []

    if (handlers && callback) {
      for (let i = 0, len = handlers.length; i < len; i++) {
        if (handlers[i].unbound !== callback) {
          liveEvents.push(handlers[i])
        }
      }
    }

    (liveEvents.length)
      ? this.h[name] = liveEvents
      : delete this.h[name]

    return this
  }

  emitErrorWithMessage(name: string, message: string, exception?: unknown): this {
    const wrappedError = wrapError(name, exception, message)
    return this.emit(ERRORS_CHANNEL, wrappedError)
  }

  emitError(name: string, exception: unknown): this {
    const wrappedError = wrapError(name, exception)
    return this.emit(ERRORS_CHANNEL, wrappedError)
  }

  ifEmpty(name: string, f: () => void): this {
    if ((this.q[name] || []).length > 0) {
      return this
    } else {
      f()
      return this
    }
  }

  emitIfEmpty(name: string, makeEvent: () => unknown): this {
    this.ifEmpty(name, () => this.emit(name, makeEvent()))
  }
}
