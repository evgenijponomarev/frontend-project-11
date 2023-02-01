develop:
	npm start

install:
	npm ci

build:
	rm -rf dist
	npm run build

lint:
	npm run lint
