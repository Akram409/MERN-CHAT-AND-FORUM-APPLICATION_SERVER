import TopicCategory from "../models/topicCaterory.model.js";

export const createTopicCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const exists = await TopicCategory.findOne({ name });
    console.log("🚀 ~ createTopicCategory ~ exists:", exists);

    if (exists) {
      return res
        .status(409)
        .json({ success: false, msg: "Category already exists" });
    }

    const newCategory = await TopicCategory.create({ name });
    res
      .status(200)
      .json({ success: true, msg: "Topic Category Created Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: err.message });
  }
};

export const getTopicCategories = async (req, res) => {
  try {
    const categories = await TopicCategory.find().select("name");

    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
