import Topic from "../models/topic.model.js";
import TopicComment from "../models/topicComment.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getUser = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.findById(loggedInUserId).select(
      "-password"
    );

    res.status(200).json({ success: true, data: filteredUsers });
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

export const handleProfileUpdate = async (req, res) => {
  const { user } = req; // Access the logged-in user from req.user
  console.log("🚀 ~ handleProfileUpdate ~ user:", user);
  const {
    fullName,
    username,
    gender,
    profilePic,
    designation,
    DateOfBirth,
    contactAddress,
    phoneNumber,
  } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        fullName,
        username,
        gender,
        profilePic,
        designation,
        DateOfBirth,
        contactAddress,
        phoneNumber,
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    res.status(200).json({
      success: true,
      msg: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Error updating profile" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    // Step 1: Find all topics authored by the user
    const topics = await Topic.find({ "author._id": loggedInUserId });

    // Step 2: Find all comments authored by the user
    const comments = await TopicComment.find({ "author._id": loggedInUserId });

    // Step 3: Delete all comments associated with the found topics
    await Promise.all(
      topics.map(async (topic) => {
        await TopicComment.deleteMany({ topicId: topic._id });
      })
    );

    // Step 4: Delete all topics authored by the user
    await Topic.deleteMany({ "author._id": loggedInUserId });

    // Step 5: Finally, delete the user itself (You need to implement this part according to your user model)
    await User.deleteOne({ _id: loggedInUserId });

    // Respond with success message
    res.clearCookie("jwt");
    res.status(200).json({
      success: true,
      msg: "Account and associated data deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};
