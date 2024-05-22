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
      validate: {
        validator: function (v) {
          return v != null || this.video != null;
        },
        message: 'Either image or video must be provided.'
      }
    },
    video: {
      type: String,
      validate: {
        validator: function (v) {
          return v != null || this.image != null;
        },
        message: 'Either image or video must be provided.'
      }
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
