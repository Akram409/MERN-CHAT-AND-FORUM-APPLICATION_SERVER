import express from "express";
import {
  deleteAccount,
  getUser,
  getUsersForSidebar,
  handleProfileUpdate,
} from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.get("/me", protectRoute, getUser);
router.put("/", protectRoute, handleProfileUpdate);
router.delete("/deleteAccount", protectRoute, deleteAccount);

export default router;
