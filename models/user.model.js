import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    designation: {
      type: String,
    },
    DateOfBirth: {
      type: Date,
    },
    phoneNumber: {
      type: String,
    },
    contactAddress: {
      type: String,
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
      },
    ],
    lastMessage: {
      type: String,
      default: null,
    },
    sender: {
      type: String,
      default: null
    },
    messageSendTime: {
      type: Date,
      default: null
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
