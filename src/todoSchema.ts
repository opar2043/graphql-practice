const typeDefs = `#graphql

  type User {
    id: ID
    name: String
    email: String
    age: Int
    role: String
    isActive: Boolean
    posts: [Post]
    postCount: Int
    comments: [Comment]
    commentCount: Int
  }

  input UserInput {
    name: String
    email: String
    age: Int
    role: String
  }

  input PostInput{
    title: String
    content: String
    published: Boolean
    authorId: ID
    tags: [String]
  }

  input CommentInput{
    text: String
    authorId: ID
    postId: ID
  }

  type Post {
    id: ID
    title: String
    content: String
    published: Boolean
    authorId: ID
    tags: [String]
  }

  type Comment {
    id: ID
    text: String
    authorId: ID
    postId: ID
  }

  type Query {
    users: [User]
    user(id: ID!) : User
    posts : [Post]
    post(id: ID!) : Post
    comments : [Comment]
  }

  type Mutation {
    createUser(input : UserInput) : User!
    updateUser(id: ID! , input: UserInput) : User!
    deleteUser(id: ID!) : User!

    createPost(input: PostInput) : Post!
    updatePost(id: ID!, input: PostInput) : Post!
    deletePost(id: ID!) : Post!

    createComment(input: CommentInput) : Comment!
    deleteComment(id: ID!) : Comment!
    updateComment(id: ID!, input: CommentInput) : Comment!
  }
`;

export default typeDefs