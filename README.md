# library
library boilerplate application

After cloning run:

```sh
$ cd library
$ docker-compose up -d
$ docker-compose exec app npx knex migrate:latest && docker-compose exec app npx knex seed:run

```
Got to http://localhost:4000

* Database service may need some time to setup
* Ports 5432 and 4000 should be available
