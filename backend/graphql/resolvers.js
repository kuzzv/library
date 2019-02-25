const library = require("../services/library");
const authentificator = require("../services/auth");
const dateResolver = require("./dateResolver");

const resolvers = {
  Query: {
    authors(_, args, { user }) {
      if (!user || !user.admin) {
        throw new Error("Not authorized");
      }
      return library.findAuthors();
    },
    books(_, args, { user }) {
      if (!user || !user.admin) {
        throw new Error("Not authorized");
      }
      return library.findBooks();
    },
    availableBooks(_, args, { user }) {
      if (!user || !user.id) {
        throw new Error("Not authorized");
      }
      return library.findAvailableBooks();
    },
    client(_, args, { user }) {
      if (!user || !user.id) {
        throw new Error("Not authorized");
      }
      return library.findClient(user.id);
    }
  },
  Date: dateResolver,
  Mutation: {
    createBook(_, { book }, { user }) {
      if (user && user.admin) {
        return library.addBook(book);
      } else {
        throw new Error("Not authorized");
      }
    },
    createAuthor(_, { author }, { user }) {
      if (user && user.admin) {
        return library.addAuthor(author);
      } else {
        throw new Error("Not authorized");
      }
    },
    takeBooks(_, { ids }, { user }) {
      if (user && user.id) {
        return library.takeBooks(user.id, ids);
      } else {
        throw new Error("Not authorized");
      }
    },
    returnBooks(_, { ids }, { user }) {
      if (user && user.id) {
        return library.returnBooks(user.id, ids);
      } else {
        throw new Error("Not authorized");
      }
    },
    authUser(
      _,
      {
        auth: { login, password }
      }
    ) {
      return authentificator.authUser(login, password);
    },
    authAdmin(
      _,
      {
        auth: { login, password }
      }
    ) {
      return authentificator.authAdmin(login, password);
    },
    registerUser(
      _,
      {
        auth: { login, password }
      }
    ) {
      return authentificator.registerUser(login, password);
    }
  }
};

module.exports = resolvers;
