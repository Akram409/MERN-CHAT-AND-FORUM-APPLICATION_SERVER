import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getGalleryData, getGalleryDataById, uploadImage, uploadVideo } from "../controllers/gallery.controller.js";
import multer from "multer";

const router = express.Router();

// Image Upload
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

// Video Upload
const videoStorage = multer.diskStorage({
    destination: 'uploads/videos',
    filename: (req, file, cb) => {
        cb(null,Date.now()+ "-" +file.originalname)
    }
});
const videoUpload = multer({
    storage: videoStorage,
    limits: {
    fileSize: 10000000 // 10000000 Bytes = 10 MB
    },
    fileFilter(req, file, cb) {
      // upload only mp4 and mkv format
      if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) { 
         return cb(new Error('Please upload a video'))
      }
      cb(undefined, true)
   }
})

router.get("/data", protectRoute, getGalleryData);
router.get("/data/:id", protectRoute, getGalleryDataById);
router.post("/image/upload/:id",protectRoute,upload.single("file"),uploadImage);
router.post("/video/upload/:id",protectRoute,videoUpload.single('video'),uploadVideo);

export default router;
