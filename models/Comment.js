const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
}).set("timestamps", true);

module.exports = model("Comment", commentSchema);
