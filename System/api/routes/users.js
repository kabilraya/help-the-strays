import express from "express";
import { getUsers, updateUser } from "../controllers/users.js";
const router = express.Router();

router.get("/find/:userId", getUsers);
router.put("/", updateUser);

export default router;
