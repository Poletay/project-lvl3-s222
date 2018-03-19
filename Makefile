#Makefile
install:
	npm install
start:
	npm start
develop:
	npx webpack --watch --mode production
lint:
	npm run eslint .
build:
	npx webpack --mode production
test:
	npm test
watch-test:
	npm run test -- --watchAll