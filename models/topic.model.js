import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TopicCategory",
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

    body: {
      type: String,
      required: true,
    },
    reactions: {},
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TopicComment",
        default: [],
      },
    ],
    bookmarksUserId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    reactions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    viewedBy: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;
