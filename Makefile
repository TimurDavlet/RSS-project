build:
	npm run build

build-dev:
	npm run dev

install:
	npm ci
	npm link

test:
	npx -n --experimental-vm-modules jest

test-coverage:
	npm test -- --coverage --coverageProvider=v8

publish:
	npm publish --dry-run

lint:
	npx eslint .

uninstall:
	npm rm --global @hexlet/code