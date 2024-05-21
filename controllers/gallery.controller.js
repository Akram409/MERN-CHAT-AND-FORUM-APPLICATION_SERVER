import Gallery from "../models/gallery.model.js";

export const getGalleryData = async (req, res) => {
  try {
    const result = await Gallery.find();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getGalleryData: ", error.message);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};
export const getGalleryDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Gallery.findById(id);
    
    if (!result) {
      return res.status(404).json({ success: false, msg: "Gallery entry not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getGalleryDataById: ", error.message);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

export const uploadImage = async (req, res) => {
  try {
    const {description} = req.body;
    const userId = req.params.id;
    const file = req.file;
  
    if (!file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    const path = "http://localhost:5000/uploads/"
    const newData ={
      userId,
      image: path+file.filename,
      description: description
    }
    
    const newGalleryEntry = new Gallery(newData);
    await newGalleryEntry.save();
    res.status(201).json({ success: true, data: newGalleryEntry });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
