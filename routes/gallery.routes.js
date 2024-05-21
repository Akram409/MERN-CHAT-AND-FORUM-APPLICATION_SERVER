import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getGalleryData, getGalleryDataById, uploadImage } from "../controllers/gallery.controller.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+ "-" +file.originalname);
    },
  });
  
  const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Validate file types (e.g., images, documents)
        if (file.mimetype.startsWith("image/") || 
        file.mimetype.startsWith("application/pdf") || 
        file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            cb(null, true);
        } else {
            cb(new Error("Only images and PDF files are allowed"));
        }
    },
});

router.get("/data", protectRoute, getGalleryData);
router.get("/data/:id", protectRoute, getGalleryDataById);
router.post("/image/upload/:id",protectRoute,upload.single("file"),uploadImage);

export default router;
