import Topic from "../models/topic.model.js";
import TopicComment from "../models/topicComment.model.js";
import User from "../models/user.model.js";

export const createTopic = async (req, res) => {
  try {
    const newTopic = await Topic.create({
      ...req.body,
      author: { ...req.user },
    });
    if (!newTopic._id) {
      return res
        .status(500)
        .json({ success: false, msg: "Error creating new topic" });
    }
    res.status(200).json({ success: true, msg: "Topic Created Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: err.message });
  }
};

export const getTopics = async (req, res) => {
  const query = req.query;
  const currentUser = req.user;
  try {
    const topics = await Topic.find({}).sort({ createdAt: -1 });
    let data = [];
    if (query.bookmarks) {
      data = topics.filter((topic) =>
        topic.bookmarksUserId.includes(currentUser._id)
      );
    } else {
      data = topics;
    }
    res.status(200).json({ success: true, data: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

export const getTopicsByAuthor = async (req, res) => {
  try {
    const { _id } = req.user;
    console.log("🚀 ~ getTopicsByAuthor ~ _id:", _id);

    const topics = await Topic.aggregate([
      {
        $match: {
          "author._id": _id.toString(),
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    res.status(200).json({ success: true, data: topics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

export const getTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await Topic.findById(id);
    if (!topic)
      return res.status(404).json({ success: false, msg: "Topic not found" });
    res.status(200).json({ success: true, data: topic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

export const deleteTopic = async (req, res) => {
  try {
    const { topicId } = req.body;
    await Topic.findByIdAndDelete(topicId);

    res.status(200).json({ success: true, msg: "Topic deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

// POST /api/bookmarks/toggle
export const toggleBookmark = async (req, res) => {
  const { topicId } = req.body;
  const currentUser = req.user;
  try {
    const user = await User.findById(currentUser._id);
    if (!user)
      return res.status(404).json({ success: false, msg: "User not found" });

    const topic = await Topic.findById(topicId);
    if (!topic)
      return res.status(404).json({ success: false, msg: "Topic not found" });

    console.log(
      "🚀 ~ toggleBookmark ~ user.bookmarks.includes(topicId):",
      user.bookmarks.includes(topicId)
    );
    if (user.bookmarks.includes(topicId)) {
      user.bookmarks = user.bookmarks.filter(
        (bookmark) => bookmark?.toString() !== topicId
      );

      topic.bookmarksUserId = topic.bookmarksUserId.filter(
        (user) => user?.toString() !== currentUser._id.toString()
      );

      await topic.save();
      await user.save();
      return res
        .status(200)
        .json({ success: true, msg: "Bookmark removed successfully" });
    }
    if (!user.bookmarks.includes(topicId)) {
      user.bookmarks.push(topicId);
      topic.bookmarksUserId.push(currentUser._id);
      await user.save();
      await topic.save();
      return res
        .status(200)
        .json({ success: true, msg: "Bookmark added successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

export const fetchBookmarks = async (req, res) => {
  try {
    const currentUser = req.user;
    console.log("🚀 ~ fetchBookmarks ~ currentUser:", currentUser);
    if (!currentUser._id) {
      return res.status(400).json({ success: false, msg: "Invalid user ID" });
    }
    const user = await User.findById(currentUser._id);
    if (!user)
      return res.status(404).json({ success: false, msg: "User not found" });
    res.status(200).json({ success: true, data: user.bookmarks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

export const topicReactionToggle = async (req, res) => {
  const { topicId } = req.body;
  const currentUser = req.user;
  try {
    const topic = await Topic.findById(topicId);
    if (!topic)
      return res.status(404).json({ success: false, msg: "Topic not found" });

    if (topic.reactions.includes(currentUser._id)) {
      topic.reactions = topic.reactions.filter(
        (userId) => userId?.toString() !== currentUser._id.toString()
      );

      await topic.save();

      return res
        .status(200)
        .json({ success: true, msg: "Reaction removed successfully" });
    }
    if (!topic.reactions.includes(currentUser._id)) {
      topic.reactions.push(currentUser._id);

      await topic.save();
      return res
        .status(200)
        .json({ success: true, msg: "Reaction added successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};
export const topicCommentReactionToggle = async (req, res) => {
  const { commentId } = req.body;
  const currentUser = req.user;
  try {
    const topicComment = await TopicComment.findById(commentId);
    if (!topicComment)
      return res.status(404).json({ success: false, msg: "Comment not found" });

    if (topicComment.reactions.includes(currentUser._id)) {
      topicComment.reactions = topicComment.reactions.filter(
        (userId) => userId?.toString() !== currentUser._id.toString()
      );

      await topicComment.save();

      return res
        .status(200)
        .json({ success: true, msg: "Reaction removed successfully" });
    }
    if (!topicComment.reactions.includes(currentUser._id)) {
      topicComment.reactions.push(currentUser._id);

      await topicComment.save();
      return res
        .status(200)
        .json({ success: true, msg: "Reaction added successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

export const incrementViewCount = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;
    const topic = await Topic.findById(id);
    if (!topic)
      return res.status(404).json({ success: false, msg: "Topic not found" });

    if (!topic?.viewedBy?.includes(currentUser._id)) {
      topic?.viewedBy?.push(currentUser._id);

      await topic.save();
      return res
        .status(200)
        .json({ success: true, msg: "View Count Incremented" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};
