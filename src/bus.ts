import { ERRORS_CHANNEL } from './consts'
import { EventBus } from './types'
import { wrapError } from './utils'

interface EventHandler {
  callback: (data: unknown) => void
  unbound: (data: unknown) => void
}

interface EmitterData {
  h: Record<string, EventHandler[]>
  q: Record<string, unknown[]>
  size: number
}

export class ReplayEmitter implements EventBus {
  private data: EmitterData

  constructor (replaySize: number | string) {
    let size = 5

    if (typeof replaySize === 'number') {
      size = replaySize
    } else {
      size = parseInt(replaySize) || size
    }

    this.data = {
      h: {},
      q: {},
      size
    }
  }

  on<F extends ((event: unknown) => void)>(name: string, callback: F, ctx?: ThisParameterType<F>): this {
    const handler: EventHandler = {
      callback: callback.bind(ctx),
      unbound: callback
    }

    this.data = { ...this.data, h: { ...this.data.h, [name]: [...(this.data.h[name] || []), handler] } };

    (this.data.q[name] || []).forEach(i => callback.call(ctx, i))

    return this
  }

  once<F extends ((event: unknown) => void)>(name: string, callback: F, ctx?: ThisParameterType<F>): this {
    const eventQueue = this.data.q[name] || []
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
    (this.data.h[name] || []).forEach(i => i.callback(event))
    const queue = this.data.q[name] || []
    const [first, ...rest] = queue
    this.data = {
      ...this.data,
      q: {
        ...this.data.q,
        [name]: [queue.length < this.data.size && first, ...rest, event].filter(Boolean)
      }
    }

    return this
  }

  off(name: string, callback: (event: unknown) => void): this {
    const handlers: EventHandler[] = this.data.h[name]
    const liveEvents: EventHandler[] = (handlers && callback && handlers.filter(h => h.unbound !== callback)) || []

    if (liveEvents.length) {
      this.data = { ...this.data, h: { ...this.data.h, [name]: liveEvents } }
    } else {
      const { [name]: f, ...rest } = this.data.h
      this.data = { ...this.data, h: rest }
    }
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
