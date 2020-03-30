used nodemon to start server on 5000
url : http://localhost:5000/graphql

sample query : 
{
  books {
    id
    author {
      id
      name
    }
  }
  authors {
    id
    name
    books{
      id
      name
    }
  }
  book(id: 2){
    name
  }
  author(id: 1){id name}
}


