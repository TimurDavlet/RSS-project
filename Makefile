start-server:
	npm run start

build:
	npm run build

build-dev:
	npm run dev

install:
	npm ci
	npm link

publish:
	npm publish --dry-run

lint:
	npx eslint .

uninstall:
	npm rm --global @hexlet/code
	