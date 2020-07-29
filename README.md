
# 4all-locadora
> Api REST for 4all-locadora app

## Build Setup

``` bash
# install dependencies
$ npm install

#compose container with postgres
$ docker-compose up -d

# serve with hot reload at localhost:4000
$ npm run dev

# launch server
$ npm start

# test application
$ npm run test

# migrate database
$ npx sequelize-cli db:migrate

# seed database
$ npx sequelize-cli db:seed:all
```

## What was used here
- [Node.js](https://nodejs.org/api/) - JavaScript runtime
- [Babel.js](https://babeljs.io) -  JavaScript compiler
- [Express.js](http://expressjs.com/pt-br/api.html) - REST api webservice 
- [Sequelize](https://sequelize.org/) - ORM for relational database
- [JWT](https://jwt.io/) - Web tokens for authentications
- [Bcrypt](https://www.npmjs.com/package/bcrypt) - Encrypting passwords
- [Swagger.io](https://swagger.io/docs/specification/about/) - Api Docs
- [Mocha](https://mochajs.org) Asynchronous testing
- [Chai](https://www.chaijs.com/) Assertion Framework
- [Docker](https://www.docker.com/) - Container with postgres and pgadmin4


## Project bootstrapping

- config - contains config file, which tells CLI how to connect with database
- models - contains all models for your project
- migrations - contains all migration files
- seeders - contains all seed files
- tests - contains all tests code
- services - contains all services codes
- controllers - contains all controllers codes
- middlewares - contains all middlewares codes
- routes - contains all declared express routes