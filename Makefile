develop:
	npm run build
	npx webpack serve

build:
	npm run build

install:
	npm ci
	npm link

publish:
	npm publish --dry-run

lint:
	npx eslint .

uninstall:
	npm rm --global @hexlet/code
