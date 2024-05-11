import mongoose from "mongoose";

const topicCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const TopicCategory = mongoose.model("TopicCategory", topicCategorySchema);

export default TopicCategory;
