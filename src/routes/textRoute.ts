import express from "express";
import { texts } from "../controllers/text";

const router = express.Router();

router.get("/data", texts);

export default router;
