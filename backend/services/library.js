const bookRepository = require("../repositories/BookRepository");
const authorRepository = require("../repositories/AuthorRepository");
const clientRepository = require("../repositories/ClientRepository");
const Author = require("../entities/Author");
const Book = require("../entities/Book");
const uuidv4 = require("uuid/v4");
const GENERAL_ERROR_MESSAGE = "Application error";

const findBooks = () => {
  return bookRepository.find();
};

const findAvailableBooks = () => {
  return bookRepository.findAvailable();
};

const findAuthors = () => {
  return authorRepository.find();
};

const findClient = id => {
  return clientRepository.findById(id)
}

const addBook = async ({ title, releasedAt, authors: authorsIds }) => {
  try {
    const authors = await authorRepository.find({ id: authorsIds });
    const id = uuidv4();
    await bookRepository.add(
      new Book(id, title, new Date(releasedAt), authors)
    );
    return await bookRepository.findById(id);
  } catch (e) {
    throw new Error(GENERAL_ERROR_MESSAGE);
  }
};

const addAuthor = async ({ name, surname, birthYear }) => {
  try {
    const id = uuidv4();
    await authorRepository.add(new Author(id, name, surname, birthYear));
    return await authorRepository.findById(id);
  } catch (e) {
    throw new Error(GENERAL_ERROR_MESSAGE);
  }
};

const takeBooks = async (clientId, booksIds) => {
  try {
    const client = await clientRepository.findById(clientId);
    const books = await bookRepository.find({ id: booksIds });
    client.takeBooks(books);
    await clientRepository.add(client);
    return await clientRepository.findById(clientId);
  } catch (e) {
    throw new Error(GENERAL_ERROR_MESSAGE);
  }
};

const returnBooks = async (clientId, booksIds) => {
  try {
    const client = await clientRepository.findById(clientId);
    client.returnBooks(booksIds);
    await clientRepository.add(client);
    return await clientRepository.findById(clientId);
  } catch (e) {
    throw new Error(GENERAL_ERROR_MESSAGE);
  }
};

module.exports = {
  findAuthors,
  findBooks,
  findAvailableBooks,
  findClient,
  addBook,
  addAuthor,
  takeBooks,
  returnBooks
};
