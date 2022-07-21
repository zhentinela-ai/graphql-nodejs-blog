const { GraphQLList, GraphQLID } = require("graphql");
const { User, Post, Comment } = require("../models");
const { UserType, PostType, CommentType } = require("./types");

const users = {
  type: new GraphQLList(UserType),
  description: "List of all users",
  resolve: () => User.find(),
};

const user = {
  type: UserType,
  description: "Get a user by id",
  args: {
    id: { type: GraphQLID },
  },
  resolve(_, args) {
    return User.findById(args.id);
  },
};

const posts = {
  type: new GraphQLList(PostType),
  description: "Get all posts",
  resolve: () => Post.find(),
};

const post = {
  type: PostType,
  description: "Get a post by id",
  args: {
    id: { type: GraphQLID },
  },
  resolve: (_, { id }) => Post.findById(id),
};

const commets = {
  type: new GraphQLList(CommentType),
  description: "Get all comments",
  resolve: () => Comment.find(),
};

const comment = {
  type: CommentType,
  description: "Get a comment by id",
  args: {
    commentId: { type: GraphQLID },
  },
  resolve: (_, { commentId }) => Comment.findById(commentId),
};

module.exports = { users, user, posts, post, commets, comment };
