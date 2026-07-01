import { Router } from "express";
import { authenticate } from "../middlewares/authentication.js";
const router = Router();

router.get("/", authenticate, (req, res) => {


  res.json({
    success: true,
    message: "Backend is running!"
  });
});

export default router;