const BOOKS_CAPACITY = 5;

class Client {
  constructor(id, name, photo, registeredAt) {
    this.id = id;
    this.name = name;
    this.photo = photo;
    this.registeredAt = registeredAt;
    this.books = [];
  }

  takeBooks(books) {
    if (this.books.length + books.length > BOOKS_CAPACITY) {
      throw new Error(`you cannot take more than ${BOOKS_CAPACITY} books`);
    }
    this.books = this.books.concat(books);
  }

  returnBooks(booksIds) {
    this.books = this.books.filter(book => !booksIds.includes(book.id));
  }
}

module.exports = Client;
