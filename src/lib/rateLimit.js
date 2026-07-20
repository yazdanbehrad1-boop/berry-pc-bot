// Minimal in-memory fixed-window rate limiter — no external dependency.
//
// Scope note: state lives in this process only. On a single free-tier
// instance (this deployment) that's exactly one shared counter; if the
// service is ever scaled to multiple instances the limit becomes per-instance
// rather than global. That's an acceptable weakening for basic abuse
// protection (email-bombing the owner, spamming the LLM) and never lets more
// through than `max * instanceCount`.
export function rateLimit({ windowMs, max, message = 'Too many requests, please slow down.' }) {
  const hits = new Map(); // key -> { count, resetAt }

  // Periodic sweep so the Map doesn't grow unbounded from one-off IPs.
  const sweep = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(key);
    }
  }, windowMs);
  if (typeof sweep.unref === 'function') sweep.unref();

  return function rateLimitMiddleware(req, res, next) {
    // req.ip is trustworthy because server.js sets `trust proxy` so Render's
    // X-Forwarded-For is honored; fall back to the socket address otherwise.
    const key = req.ip || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= max) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader('Retry-After', String(retryAfter));
      return res.status(429).json({ error: message });
    }

    entry.count += 1;
    return next();
  };
}
