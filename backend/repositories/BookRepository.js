const knex = require("knex")(require("../knexfile"));
const Book = require("../entities/Book");
const Author = require("../entities/Author");
const BOOKS_TABLE_NAME = "books";
const BOOKS_WITH_AUTHORS_VIEW_NAME = "books_with_authors";
const BOOKS_AVAILABLE_VIEW_NAME = "available_books";
const BOOKS_AUTHORS_TABLE_NAME = "books_authors";

const add = ({ id, title, releasedAt, authors }) => {
  return knex.transaction(async trx => {
    const [bookId] = await trx
      .insert({
        id,
        title,
        released_at: releasedAt
      })
      .into(BOOKS_TABLE_NAME)
      .returning("id");
    await trx
      .insert(
        authors.map(author => ({
          book_id: bookId,
          author_id: author.id
        }))
      )
      .into(BOOKS_AUTHORS_TABLE_NAME);
  });
};

const findById = id => {
  return knex(BOOKS_WITH_AUTHORS_VIEW_NAME)
    .first()
    .where({ id });
};

const find = ({ id } = {}) => {
  const query = knex(BOOKS_WITH_AUTHORS_VIEW_NAME);
  if (id && Array.isArray(id)) {
    query.whereIn("id", id);
  }
  return query.then(books =>
    books.map(
      book =>
        new Book(
          book.id,
          book.title,
          new Date(book.released_at),
          book.authors
            ? book.authors.map(
                author =>
                  new Author(
                    author.id,
                    author.name,
                    author.surname,
                    author.birth_year
                  )
              )
            : []
        )
    )
  );
};

const findAvailable = () => {
  return knex(BOOKS_AVAILABLE_VIEW_NAME).then(books =>
    books.map(
      book =>
        new Book(
          book.id,
          book.title,
          new Date(book.released_at),
          book.authors
            ? book.authors.map(
                author =>
                  new Author(
                    author.id,
                    author.name,
                    author.surname,
                    author.birth_year
                  )
              )
            : []
        )
    )
  );
}

const remove = id =>
  knex(BOOKS_TABLE_NAME)
    .where({ id })
    .delete();

module.exports = {
  add,
  findById,
  find,
  findAvailable,
  remove
};
