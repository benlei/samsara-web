## Getting Started

In one terminal, run:

```
nvm exec npx @cloudflare/next-on-pages --watch
```

Wait for it to complete. Then in another terminal, run:
```
nvm exec npx wrangler pages dev .vercel/output/static --compatibility-flags=streams_enable_constructors
```

Whenever cloudflare figures a way to make it a 1-pass type of system + I learn about it, I'll update.
