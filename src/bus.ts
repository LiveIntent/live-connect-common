import { ERRORS_CHANNEL } from './consts'
import { EventBus } from './types'
import { wrapError } from './utils'

interface EventHandler {
  callback: (data: unknown) => void
  unbound: (data: unknown) => void
}

export class ReplayEmitter implements EventBus {
  private h: Record<string, EventHandler[]>
  private q: Record<string, unknown[]>
  size: number

  constructor (replaySize: number | string) {
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
}
