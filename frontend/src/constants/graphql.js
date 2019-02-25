import gql from "graphql-tag";

export const AVAILABLE_BOOKS_QUERY = gql`
  query availableBooks {
    availableBooks {
      id
      title
      releasedAt
      authors {
        name
        surname
        birthYear
      }
    }
  }
`;

export const BOOKS_QUERY = gql`
  query books {
    books {
      id
      title
      releasedAt
      authors {
        name
        surname
        birthYear
      }
    }
  }
`;

export const AUTHORS_QUERY = gql`
  query authors {
    authors {
      id
      name
      surname
      birthYear
      books {
        title
        releasedAt
      }
    }
  }
`;

export const ADD_BOOK = gql`
  mutation($book: BookInput) {
    createBook(book: $book) {
      title
    }
  }
`;

export const ADD_AUTHOR = gql`
  mutation createAuthor($author: AuthorInput) {
    createAuthor(author: $author) {
      name
    }
  }
`;

export const UPLOAD_PHOTO = gql`
  mutation uploadPhoto($photo: Upload!) {
    uploadPhoto(photo: $photo)
  }
`

export const CLIENT_QUERY = gql`
  query client {
    client {
      name
      registeredAt
      photo
      books {
        id
        title
        releasedAt
        authors {
          name
          surname
        }
      }
    }
  }
`;

export const TAKE_BOOKS = gql`
  mutation takeBooks($ids: [ID]) {
    takeBooks(ids: $ids) {
      name
    }
  }
`;

export const RETURN_BOOKS = gql`
  mutation returnBooks($ids: [ID]) {
    returnBooks(ids: $ids) {
      name
    }
  }
`;

export const AUTH_USER = gql`
  mutation authUser($login: String!, $password: String!) {
    authUser(auth: { login: $login, password: $password })
  }
`;

export const AUTH_ADMIN = gql`
  mutation authAdmin($login: String!, $password: String!) {
    authAdmin(auth: { login: $login, password: $password })
  }
`;
