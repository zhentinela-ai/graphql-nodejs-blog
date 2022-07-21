const { GraphQLString, GraphQLID } = require("graphql");
const { User, Post, Comment } = require("../models");
const { createJWTToken } = require("../util/auth");
const { PostType, CommentType } = require("./types");

const register = {
  type: GraphQLString,
  description: "Registre a new user and return a token",
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    displayName: { type: GraphQLString },
  },
  async resolve(_, args) {
    const { username, email, password, displayName } = args;

    // const newUser = await User.create({ username, email, password, displayName });
    const user = new User({ username, email, password, displayName });
    await user.save();

    const token = createJWTToken({
      _id: user._id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
    });

    return token;
  },
};

const login = {
  type: GraphQLString,
  description: "Login a user and return a token",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(_, args) {
    const user = await User.findOne({ email: args.email }).select("+password");

    if (!user || args.password !== user.password)
      throw new Error("Invalid credentials");

    const token = createJWTToken({
      _id: user._id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
    });

    return token;
  },
};

const createPost = {
  type: PostType,
  description: "Create a new post",
  args: {
    title: { type: GraphQLString },
    body: { type: GraphQLString },
  },
  async resolve(_, args, { verifiedUser }) {
    const post = new Post({
      title: args.title,
      body: args.body,
      authorId: verifiedUser._id,
    });
    await post.save();

    return post;
  },
};

const updatePost = {
  type: PostType,
  description: "Update a post",
  args: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
  },
  async resolve(_, { id, title, body }, { verifiedUser }) {
    if (!verifiedUser) throw new Error("Unauthorized");

    const updatePost = await Post.findByIdAndUpdate(
      { _id: id, authorId: verifiedUser._id },
      {
        title,
        body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return updatePost;
  },
};

const deletePost = {
  type: GraphQLString,
  description: "Delete a post",
  args: {
    postId: { type: GraphQLID },
  },
  async resolve(_, { postId }, { verifiedUser }) {
    if (!verifiedUser) throw new Error("Unauthorized");

    const postDeleted = await Post.findByIdAndDelete({
      _id: postId,
      authorId: verifiedUser._id,
    });

    if (!postDeleted) throw new Error("Post not found");

    return "Delete post successfully";
  },
};

const addComment = {
  type: CommentType,
  description: "Add a comment to a post",
  args: {
    postId: { type: GraphQLID },
    comment: { type: GraphQLString },
  },
  async resolve(_, { postId, comment }, { verifiedUser }) {
    if (!verifiedUser) throw new Error("Unauthorized");

    const newComment = new Comment({
      comment,
      postId,
      userId: verifiedUser._id,
    });
    newComment.save();

    return newComment;
  },
};

const updateComment = {
  type: CommentType,
  description: "Update a comment",
  args: {
    commentId: { type: GraphQLID },
    comment: { type: GraphQLString },
  },
  async resolve(_, { commentId, comment }, { verifiedUser }) {
    if (!verifiedUser) throw new Error("Unauthorized");

    const updateComment = await Comment.findByIdAndUpdate(
      {
        _id: commentId,
        userId: verifiedUser._id,
      },
      {
        comment,
      }
    );

    return updateComment;
  },
};

const deleteComment = {
  type: GraphQLString,
  description: "Delete a comment",
  args: {
    commentId: { type: GraphQLID },
  },
  async resolve(_, { commentId }, { verifiedUser }) {
    if (!verifiedUser) throw new Error("Unauthorized");

    const commentDeleted = await Comment.findByIdAndDelete({
      _id: commentId,
      userId: verifiedUser._id,
    });

    if (!commentDeleted) throw new Error("Comment not found");

    return "Delete comment successfully";
  },
};

module.exports = {
  register,
  login,
  createPost,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deleteComment,
};
