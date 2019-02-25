const uuidv4 = require("uuid/v4");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.seed = async knex => {
  const booksIds = Array(4)
    .fill(undefined)
    .map(() => uuidv4());
  const authorsIds = Array(3)
    .fill(undefined)
    .map(() => uuidv4());
  const clientsIds = Array(3)
    .fill(undefined)
    .map(() => uuidv4());

  await knex("books_authors").del();
  await knex("books").del();
  await knex("authors").del();
  await knex("clients").del();
  await knex("books").insert([
    { id: booksIds[0], title: "Shining", released_at: new Date("1977-01-28") },
    { id: booksIds[1], title: "Solaris", released_at: new Date("1961-01-01") },
    {
      id: booksIds[2],
      title: "Dick Sand, A Captain at Fifteen",
      released_at: new Date("1878-12-15")
    },
    {
      id: booksIds[3],
      title: "Should be amazing Book",
      released_at: new Date("2100-12-15")
    }
  ]);
  await knex("authors").insert([
    { id: authorsIds[0], name: "Stephen", surname: "King", birth_year: 1947 },
    { id: authorsIds[1], name: "Stanislaw", surname: "Lem", birth_year: 1921 },
    { id: authorsIds[2], name: "Jules", surname: "Verne", birth_year: 1828 }
  ]);
  await knex("books_authors").insert([
    {
      author_id: authorsIds[0],
      book_id: booksIds[0]
    },
    {
      author_id: authorsIds[1],
      book_id: booksIds[1]
    },
    {
      author_id: authorsIds[2],
      book_id: booksIds[2]
    },
    {
      author_id: authorsIds[0],
      book_id: booksIds[3]
    },
    {
      author_id: authorsIds[1],
      book_id: booksIds[3]
    },
    {
      author_id: authorsIds[2],
      book_id: booksIds[3]
    }
  ]);
  await knex("clients").insert([
    {
      id: clientsIds[0],
      name: "client1",
      password: await bcrypt.hash("password", saltRounds)
    }
  ]);
};
