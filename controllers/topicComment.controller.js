import Topic from "../models/topic.model.js";
import TopicComment from "../models/topicComment.model.js";

export const postTopicComment = async (req, res) => {
  try {
    const payload = req.body;
    const topic = await Topic.findById(payload.topicId);
    if (!topic)
      return res.status(404).json({ success: false, msg: "Topic not found" });
    const newComment = await TopicComment.create({
      ...payload,
      author: req.user,
    });
    if (!newComment) {
      return res
        .status(500)
        .json({ success: false, msg: "Error posting comment" });
    }
    res.status(200).json({ success: true, msg: "Comment posted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

export const getTopicComments = async (req, res) => {
  try {
    const { topicId } = req.params;
    if (!topicId) {
      return res
        .status(400)
        .json({ success: false, msg: "Topic id not given" });
    }
    const comments = await TopicComment.find({ topicId: topicId });
    res.status(200).json({ success: true, data: comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};
