import mongoose from "mongoose";

const topicCommentSchema = new mongoose.Schema(
  {
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    author: {
      _id: String,
      fullName: String,
      username: String,
      gender: String,
      profilePic: String,
      designation: String,
    },
    comment: {
      type: String,
      require: true,
    },
    reactions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const TopicComment = mongoose.model("TopicComment", topicCommentSchema);

export default TopicComment;
