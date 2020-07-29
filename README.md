

#API DOCS

# Modules

[Node.js] (https://nodejs.org/api/) - Interpretador de código JS
[Babel.js] (https://babeljs.io) -  transcompilador JavaScrip
[Express.js](http://expressjs.com/pt-br/api.html) - REST api webservice 
[Sequelize] (https://sequelize.org/) - ORM para banco de dados relacional
[JWT](https://jwt.io/) - Criação e tratamento de web tokens para autenticação
[Bcrypt](https://www.npmjs.com/package/bcrypt) - Criptografia de senhas
[Swagger.io](https://swagger.io/docs/specification/about/) - Especificação de documentação

# Tools
[Docker] - Container 

# Scripts

npm run dev - Start project in dev mode with nodemon and babel
npm run start - Start project with babel

#Project bootstrapping

config - contains config file, which tells CLI how to connect with database
models - contains all models for your project
migrations - contains all migration files
seeders - contains all seed files
src - contains all source code
tests - contains all tests code
services - contains all service codes
controller - contains controllers of every route
routes - contains all declared express routes

# Run Project

Instale os Modulos
 $ npm install

Suba o Container do Docker com a imagem do postgress e pgadmin:
 $ docker-compose up -d

Migre o banco de dados
 $npx sequelize-cli db:migrate

Popule o banco de dados:
  $npx sequelize-cli db:seed:all

Inicie a aplicacao
 $ npm run test // test
 $ npm run dev // dev
 $ npm run start // prod