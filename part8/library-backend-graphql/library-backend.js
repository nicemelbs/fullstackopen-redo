const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const Author = require('./src/models/author')
const Book = require('./src/models/book')
const User = require('./src/models/user')

const mongoose = require('mongoose')
require('dotenv').config()
const MONGODB_URI = process.env.MONGODB_URI
const jwt = require('jsonwebtoken')
const { GraphQLError } = require('graphql')

console.log('connecting to ', MONGODB_URI)
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB: ', error.message)
  })

let authors = [
  {
    name: 'Robert Martin',
    id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
    born: 1963,
  },
  {
    name: 'Fyodor Dostoevsky',
    id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
    born: 1821,
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
 */

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'design'],
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'crime'],
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'revolution'],
  },
]

/*
  you can remove the placeholder query once your first one has been implemented 
*/

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
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allAuthors: async () => Author.find({}),
    allBooks: async (root, args) => {
      let filters = {}
      if (args.author) {
        const foundAuthor = await Author.findOne({ name: args.author })
        if (!foundAuthor) return null

        filters.author = foundAuthor._id
      }
      if (args.genre) {
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        filters.genres = { $regex: new RegExp(escapeRegex(args.genre), 'i') }
      }

      return await Book.find(filters)
    },
    me: (root, args, context) => {
      const { currentUser } = context
      if (!currentUser) {
        throw new GraphQLError('You are not logged in', {
          extensions: {
            code: 'FORBIDDEN',
          },
        })
      }
      return currentUser
    },
    allGenres: async () => {
      const allBooks = await Book.find({})
      const allGenres = allBooks.reduce(
        (acc, book) => acc.concat(book.genres),
        []
      )

      return [...new Set(allGenres)].toSorted()
    },
  },

  Author: {
    books: async (root) =>
      await Promise.all(root.books.map((book) => Book.findById(book._id))),
    bookCount: (root) => root.books.length,
  },

  Book: {
    author: async (root) => await Author.findById(root.author._id),
  },

  User: {
    favoriteBooksInGenre: async (root) =>
      await Book.find({
        genres: { $regex: new RegExp(root.favoriteGenre, 'i') },
      }),
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const { currentUser } = context
      if (!currentUser) {
        throw new GraphQLError('Forbidden. You must be logged in to do that.', {
          extensions: {
            code: 'FORBIDDEN',
          },
        })
      }

      const { author, title, published, genres } = args

      if (title.length < 4) {
        throw new GraphQLError(
          'Error saving Book. Title must be at least 4 characters long.',
          {
            extensions: {
              code: 'GRAPHQL_VALIDATION_FAILED',
              invalidArgs: title,
            },
          }
        )
      }

      if (author.length < 4) {
        throw new GraphQLError(
          'Error saving Author and Book. Author name must be at least 4 characters long.',
          {
            extensions: {
              code: 'GRAPHQL_VALIDATION_FAILED',
              invalidArgs: author,
            },
          }
        )
      }

      const authorInDb =
        (await Author.findOne({ name: author })) ??
        (await Author.create({ name: author }))

      const newBook = new Book({
        author: authorInDb._id,
        title,
        published,
        genres,
      })
      await newBook.save()
      authorInDb.books = authorInDb.books.concat(newBook._id)
      await authorInDb.save()

      return newBook
    },

    editAuthor: async (root, args, context) => {
      const { currentUser } = context
      if (!currentUser) {
        throw new GraphQLError('Forbidden. You must be logged in to do that.', {
          extensions: {
            code: 'FORBIDDEN',
          },
        })
      }

      const { name, setBornTo } = args
      const authorToEdit = await Author.findOne({ name })
      if (!authorToEdit) return null
      authorToEdit.born = setBornTo

      await authorToEdit.save()

      return authorToEdit
    },

    createUser: async (root, args) => {
      const { username, favoriteGenre } = args

      const user = new User({ username, favoriteGenre })
      await user.save()

      return user
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }
      return { value: jwt.sign(userForToken, process.env.SECRET) }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET)
      const currentUser = await User.findById(decodedToken.id).populate(
        'favoriteGenre'
      )
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
