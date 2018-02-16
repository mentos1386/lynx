# Lynx Framework

## Built with

- [Nest.js](http://nestjs.com/) for Angular-like structure and dependency injection
- [TypeORM](http://typeorm.io/) for ORM with database
- [class-validator](https://github.com/pleerock/class-validator) for input validation

## Usage

### Install
```
$ npm install
```
Create new file `.env` in project root folder using `example.env` as a template. 

### Start

Development environment:
```
$ npm run start
```

Production environment:
```
$ npm run build
$ node dist/src/api.ts
```

### Initial database creation
```
$ npm run migrate sync
```

### Migrations
Creating new migration named `createSomeModel`:
```
$ npm run migrate create createSomeModel
```
Other commands are self-explanatory:
```
$ npm run migrate [up|down|executed|pending|create]
```

### E2E Testing
First run the testing server:
```
$ npm run start:test
```
Then run Mocha testing framework:
```
$ mocha test/*.spec.ts
```
Before hooks in `e2e/` directory will clean test database, initialize sequelize and seed fake data.
