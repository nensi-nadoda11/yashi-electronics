import type { RequestHandler } from 'express'
import { AppError } from '../utils/app-error'

type RateLimitOptions = {
  windowMs: number
  max: number
  message: string
}

type RateLimitBucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, RateLimitBucket>()

const buildRateLimitKey = (request: Parameters<RequestHandler>[0]) =>
  `${request.ip}:${request.method}:${request.baseUrl}${request.path}`

const pruneExpiredBuckets = () => {
  const now = Date.now()

  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key)
    }
  }
}

export const createRateLimit = ({ windowMs, max, message }: RateLimitOptions): RequestHandler => {
  return (request, _response, next) => {
    const key = buildRateLimitKey(request)
    const now = Date.now()
    const existingBucket = buckets.get(key)

    if (!existingBucket || existingBucket.resetAt <= now) {
      buckets.set(key, {
        count: 1,
        resetAt: now + windowMs,
      })
      pruneExpiredBuckets()
      next()
      return
    }

    if (existingBucket.count >= max) {
      next(new AppError(message, 429))
      return
    }

    existingBucket.count += 1
    buckets.set(key, existingBucket)
    next()
  }
}
