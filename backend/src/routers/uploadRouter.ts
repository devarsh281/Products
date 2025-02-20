import express, { Request, Response } from "express";
import { upload } from "../multer";


const router = express.Router();

router.post("/upload", upload.single("image"), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ message: "File uploaded successfully", imageUrl });
});

export default router; 
