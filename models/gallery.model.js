import mongoose from "mongoose";
const gallerySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User'
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;
