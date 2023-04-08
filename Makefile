default: build

build:
	source "$(NVM_DIR)/nvm.sh" && nvm exec npm run build && nvm exec npm run export

serve: build
	source "$(NVM_DIR)/nvm.sh" && nvm exec npm run start

dev:
	source "$(NVM_DIR)/nvm.sh" && nvm exec npm run dev

test:
	source "$(NVM_DIR)/nvm.sh" && nvm exec npm test

lint:
	source "$(NVM_DIR)/nvm.sh" && nvm exec -- npm run lint


e2e:
	source "$(NVM_DIR)/nvm.sh" && nvm exec -- playwright install --with-deps
	source "$(NVM_DIR)/nvm.sh" && nvm exec -- playwright test

.PHONY: test build