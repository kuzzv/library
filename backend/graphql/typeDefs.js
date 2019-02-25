const { gql } = require("apollo-server-koa");
const typeDefs = gql`
  scalar Date

  type Book {
    id: ID!
    title: String!
    releasedAt: Date!
    authors: [Author]
  }

  type Author {
    id: ID
    name: String!
    surname: String!
    birthYear: Int!
    books: [Book]
  }

  type Client {
    id: ID
    name: String!
    registeredAt: Date!
    photo: String
    books: [Book]
  }

  input BookInput {
    title: String!
    releasedAt: String!
    authors: [ID]!
  }

  input AuthorInput {
    name: String!
    surname: String!
    birthYear: Int!
  }

  input Auth {
    login: String
    password: String
  }

  type Query {
    authors: [Author]
    books: [Book]
    availableBooks: [Book]
    client: Client
  }

  type Mutation {
    uploadPhoto(photo: Upload!): String!
    createBook(book: BookInput): Book
    createAuthor(author: AuthorInput): Author
    takeBooks(ids: [ID]): Client
    returnBooks(ids: [ID]): Client
    authUser(auth: Auth): String!
    registerUser(auth: Auth): String!
    authAdmin(auth: Auth): String!
  }
`;

module.exports = typeDefs;
