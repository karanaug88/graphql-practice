const express = require('express');
const expressGraphQL = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt
} = require('graphql');

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'Author of a particular book',
  fields: () => ({
    id: {type: GraphQLNonNull(GraphQLInt)},
    name: {type: GraphQLNonNull(GraphQLString)},
    books: {
      type: GraphQLList(BookType),
      description: 'books written by this author',
      resolve: (author) => books.filter(book => book.authorId === author.id)
    }
  })
});

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'this represents a book written by an author',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt)},
    name: {type: GraphQLNonNull(GraphQLString)},
    author: {
      type: AuthorType,
      description: 'represents the list of author of a particular book',
      resolve: (book) => {
        //console.log('querying author with id', book.id);
        return authors.find(author => author.id === book.authorId)
      }
    }
  })
});
const authors = [
  { id: 1, name: 'J. K. Rowling' },
  { id: 2, name: 'J. R. R. Tolkien' },
  { id: 3, name: 'Brent Weeks' }
];

const books = [
  { id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
  { id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
  { id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
  { id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
  { id: 5, name: 'The Two Towers', authorId: 2 },
  { id: 6, name: 'The Return of the King', authorId: 2 },
  { id: 7, name: 'The Way of Shadows', authorId: 3 },
  { id: 8, name: 'Beyond the Shadows', authorId: 3 }
];

/*const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'HelloWorld',
    fields: () => ({
      message: {
        type:GraphQLString,
        resolve: () => 'returning hello'
      }
    })
  })
});*/

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root query for mutations',
  fields: () => ({
    addBook: {
      type: BookType,
      description: 'add a book',
      args: {
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)}
      },
      resolve: (parent, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorId
        };
        console.log(book);
        books.push(book);
        return book;
      }
    }
  })
});
const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query for our application',
  fields: () => ({
    book: {
      type: BookType,
      description: 'Get a particular book',
      args: {
        id: { type: GraphQLInt}
      },
      resolve: (parent, args) => books.find(book => book.id === args.id)
    },
    books: {
      type: GraphQLList(BookType),
      description: 'List of all books',
      resolve: () => books
    },
    authors: {
      type: GraphQLList(AuthorType),
      description: 'List of all authors',
      resolve: () => authors
    },
    author: {
      type: BookType,
      description: 'Get a particular author',
      args: {
        id: { type: GraphQLInt}
      },
      resolve: (parent, args) => authors.find(author => author.id === args.id)
    }
  })
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

const app = express();

app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true
}));
app.listen(5000., () => console.log('servrer running'));
