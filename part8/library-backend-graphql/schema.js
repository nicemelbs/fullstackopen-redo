const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
    favoriteBooksInGenre: [Book!]
  }

  type Token {
    value: String!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    books: [Book!]!
    bookCount: Int!
  }
  
  type Book {
    author: Author!
    title: String!
    id: String!
    genres: [String!]
    published: Int!
  }
  
  type Query {
    bookCount: Int!
    authorCount: Int!
    allAuthors: [Author!]!
    allBooks(author: String, genre: String): [Book!]
    me: User!
    allGenres: [String!]!
  }

  type Mutation {
    addBook (
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!

    editAuthor (
      name: String!
      setBornTo: Int!
    ): Author!
  
    createUser (
      username: String!
      favoriteGenre: String!
    ): User!

    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`

module.exports = typeDefs
