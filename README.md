
# 4all-locadora
> Api REST for 4all-locadora app

## Build Setup

``` bash
# install dependencies
$ npm install

# compose container with postgres
$ docker-compose up -d

# migrate database
$ node_modules/.bin/sequelize db:migrate
# with sequelize-cli
$ npx sequelize-cli db:migrate

# seed database
$ node_modules/.bin/sequelize db:seed:all
# with sequelize-cli
$ npx sequelize-cli db:seed:all

# serve with hot reload at localhost:4000
$ npm run dev

# launch server
$ npm start

# test application
$ npm run test

# API DOCS: http://localhost:4000/api-docs
```

## Instructions
After runing the project in dev mode, you can access the documentation with every route specification at
  - http://localhost:4000/api-docs

If you generated the database from migrate and seed as described above, you can use theese default sample users to authenticate.
  - admin:
    - email: admin@admin.com
    - password: adminadmin
  - client:
    - email: admin@admin.com
    - password: clientclient

The authorization token should be in the header with the following format
  - Authorization: Bearer < token >

If you need to change any database configuration params, you can do it at
  - ./config
    - config.json

If you are using the docker container setted up from docker-compose.yaml file, the default pgAdmin4 credentals are
  - email: admin@admin
  - password: admin

and postgres default password:
  - password: adminadmin

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
- models - contains all models and data structure
- migrations - contains all database migration files
- seeders - contains all seed files,
- tests - contains all tests code,
- services - contains all services and business logic
- controllers - contains all controllers that links routes with services
- middlewares - contains all middlewares, like jwt validation for authenticated users
- routes - contains all declared express http routes