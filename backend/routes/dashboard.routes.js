// backend/routes/dashboard.routes.js
import express from "express";
import { getDashboardStats } from "../Controllers/dashboard.controller.js"; // 👈 ajusta 'controllers' vs 'Controllers'

const router = express.Router();

router.get("/stats", getDashboardStats);

export default router;
