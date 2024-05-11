import express from "express";
import {
  createTopic,
  deleteTopic,
  fetchBookmarks,
  getTopic,
  getTopics,
  getTopicsByAuthor,
  incrementViewCount,
  toggleBookmark,
  topicCommentReactionToggle,
  topicReactionToggle,
} from "../controllers/topic.controller.js";
import {
  createTopicCategory,
  getTopicCategories,
} from "../controllers/topicCategory.controller.js";
import {
  getTopicComments,
  postTopicComment,
} from "../controllers/topicComment.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/", protectRoute, createTopic);
router.post("/reactions/toggle", protectRoute, topicReactionToggle);
router.post("/category", protectRoute, createTopicCategory);
router.get("/category", protectRoute, getTopicCategories);
router.get("/", protectRoute, getTopics);
router.delete("/", protectRoute, deleteTopic);
router.get("/me", protectRoute, getTopicsByAuthor);
router.post("/comment", protectRoute, postTopicComment);
router.post(
  "/comment/reactions/toggle",
  protectRoute,
  topicCommentReactionToggle
);
router.get("/bookmarks/get", protectRoute, fetchBookmarks);
router.post("/bookmarks/toggle", protectRoute, toggleBookmark);
router.get("/:id", protectRoute, getTopic);
router.get("/comment/:topicId", protectRoute, getTopicComments);
router.post("/incrementViewCount/:id", protectRoute, incrementViewCount);

export default router;
