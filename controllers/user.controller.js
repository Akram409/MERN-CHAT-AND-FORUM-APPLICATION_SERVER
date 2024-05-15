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
  const { fullName, username, gender, password, profilePic } = req.body;
  console.log("🚀 ~ handleProfileUpdate ~ profilePic:", profilePic);

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        fullName,
        username,
        gender,
        profilePic, // Update profilePic if present
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    if (password) {
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
