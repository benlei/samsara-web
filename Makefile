default: build

build:
	source "$(NVM_DIR)/nvm.sh" && nvm exec npx @cloudflare/next-on-pages

watch:
	source "$(NVM_DIR)/nvm.sh" && nvm exec npx @cloudflare/next-on-pages --watch

web:
	source "$(NVM_DIR)/nvm.sh" && nvm exec npx wrangler pages dev .vercel/output/static --compatibility-flags=streams_enable_constructors

test:
	source "$(NVM_DIR)/nvm.sh" && nvm exec npm test

lint:
	source "$(NVM_DIR)/nvm.sh" && nvm exec -- npm run lint

e2e:
	source "$(NVM_DIR)/nvm.sh" && nvm exec -- playwright install --with-deps
	source "$(NVM_DIR)/nvm.sh" && nvm exec -- playwright test

.PHONY: test