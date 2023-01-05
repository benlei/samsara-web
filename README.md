## Getting Started

In one terminal, run:

```
make build
```

Wait for it to complete. Then in another terminal, run:
```
make web
```

Whenever cloudflare figures a way to make it a 1-pass type of system + I learn about it, I'll update.


## Special notes

Yes I know this isn't an SSR app. Initially I thought I could with Cloudflare Pages, but things didn't work out.
In particular it didn't look like it could really use events in experimental-edge mode.