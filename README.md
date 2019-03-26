# Lynx Framework
> **ABANDONED PROJECT** Sadly i don't have enough time to focus on this project. Might return to it sometime in the future.

> For now, it can be taken as a referance, but not an actual framework.

## Built with
_**Bold** are required components (not easy to replace)_

 Component |                      Using                      | Descrption
---------- | ----------------------------------------------- | ----------
**Base**   | [NestJS](https://nestjs.com)                    |
**Database**| [TypeORM](http://typeorm.io/)                   |
**File Upload**| [Multer](https://github.com/expressjs/multer)   |
Logger     | [Winston](https://github.com/winstonjs/winston) |
Error Reporting| [Sentry](https://sentry.io/welcome/)        |
Validation | [Class-Validator](https://github.com/typestack/class-validator)|
Documentation| [Swagger](https://swagger.io)                 |
Configuration| [Dotenv](https://github.com/motdotla/dotenv)  |
Authentication| [Passport.js](http://www.passportjs.org)     |
Testing    | [Mocha](https://mochajs.org) & [Chai](http://chaijs.com)|
Code Style | [Airbnb](https://github.com/airbnb/javascript) & [TS-Lint](https://palantir.github.io/tslint/)|

## Progress

 - [x] File Upload (disk, s3, memory)
 - [ ] Authentication (JWT, OAuth)
 - [x] Logger
 - [ ] Request Context
 - [ ] Error Reporting
 - [ ] Database Migrations
 - [ ] Database Seeding
 - [ ] Testing (e2e, unit)

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
