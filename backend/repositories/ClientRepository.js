const knex = require("knex")(require("../knexfile"));
const Client = require("../entities/Client");
const Book = require("../entities/Book");
const CLIENTS_TABLE_NAME = "clients";
const CLIENTS_WITH_BOOKS_VIEW_NAME = "clients_with_books";
const CLIENTS_BOOKS_TABLE_NAME = "clients_books";

const findById = id => {
  return knex(CLIENTS_WITH_BOOKS_VIEW_NAME)
    .first()
    .where({ id })
    .then(({ id, name, photo, registered_at, books }) => {
      const client = new Client(id, name, photo, new Date(registered_at));
      books
        ? client.takeBooks(
            books.map(
              book => new Book(book.id, book.title, new Date(book.released_at), book.authors)
            )
          )
        : null;
      return client;
    });
};

const add = ({ id, name, photo, registeredAt, books }) => {
  return knex.transaction(async trx => {
    const existingId = await trx(CLIENTS_TABLE_NAME)
      .select("id")
      .where({ id });
    if (existingId) {
      await trx(CLIENTS_TABLE_NAME)
        .update({
          name,
          photo
        })
        .where({ id });
    } else {
      trx(CLIENTS_TABLE_NAME)
        .insert({
          name,
          photo,
          registered_at: registeredAt
        })
        .where({ id });
    }
    await trx(CLIENTS_BOOKS_TABLE_NAME)
      .where({
        client_id: id
      })
      .delete();
    await trx(CLIENTS_BOOKS_TABLE_NAME).insert(
      books.map(book => ({
        book_id: book.id,
        client_id: id
      }))
    );
  });
};

module.exports = {
  add,
  findById
};
