const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Book = require('./src/models/book')
const Author = require('./src/models/author')
const User = require('./src/models/user')

const jwt = require('jsonwebtoken')

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

      pubsub.publish('BOOK_ADDED', { bookAdded: newBook })
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

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED'),
    },
  },
}

module.exports = resolvers
