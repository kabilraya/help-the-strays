import express from "express";
import { getLikes, postLikes, deleteLikes } from "../controllers/likes.js";
const router = express.Router();

router.get("/", getLikes);
router.post("/", postLikes);
router.delete("/", deleteLikes);

export default router;
