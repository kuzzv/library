const knex = require("knex")(require("../knexfile"));
const Author = require("../entities/Author");
const AUTHORS_TABLE_NAME = "authors";

const add = ({ id, name, surname, birthYear }) => {
  return knex(AUTHORS_TABLE_NAME).insert({
    id,
    name,
    surname,
    birth_year: birthYear
  });
};

const findById = id => {
  return knex(AUTHORS_TABLE_NAME)
    .first()
    .where({ id })
    .then(
      author =>
        new Author(author.id, author.name, author.surname, author.birth_year)
    );
};

const find = ({ id } = {}) => {
  const query = knex(AUTHORS_TABLE_NAME);
  if (id) {
    if (Array.isArray(id)) {
      query.whereIn("id", id);
    } else {
      query.where({ id });
    }
  }
  return query.then(authors =>
    authors.map(
      author =>
        new Author(author.id, author.name, author.surname, author.birth_year)
    )
  );
};

const remove = id =>
  knex(AUTHORS_TABLE_NAME)
    .where({ id })
    .delete();

module.exports = {
  add,
  findById,
  find,
  remove
};
