# library
library boilerplate application

After cloning run:

```sh
$ docker-compose up -d && docker-compose exec app npx knex migrate:latest && docker-compose exec app npx knex seed:run

```

Got to http://localhost:4000
