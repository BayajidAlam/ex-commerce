const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { auth } = require("../middleware/auth");

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Upload routes working!" });
});

// Upload multiple images to Cloudinary
router.post(
  "/cloudinary",
  auth,
  upload.array("images", 10),
  async (req, res) => {
    try {
      console.log("🖼️ Upload request received:", {
        fileCount: req.files?.length || 0,
        user: req.user?.id,
      });

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "ecommerce/products",
              transformation: [
                { width: 800, height: 800, crop: "limit", quality: "auto" },
              ],
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          uploadStream.end(file.buffer);
        });
      });

      const results = await Promise.allSettled(uploadPromises);

      const successful = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      const failed = results
        .filter((result) => result.status === "rejected")
        .map((result) => result.reason);

      console.log("✅ Upload results:", {
        successful: successful.length,
        failed: failed.length,
      });

      res.json({
        success: true,
        message: `Successfully uploaded ${successful.length} images`,
        successful,
        failed,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload images",
        error: error.message,
      });
    }
  }
);

// Upload single image to Cloudinary
router.post(
  "/cloudinary-single",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("🖼️ Single upload request received:", {
        hasFile: !!req.file,
        user: req.user?.id,
      });

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "ecommerce/products",
            transformation: [
              { width: 800, height: 800, crop: "limit", quality: "auto" },
            ],
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(req.file.buffer);
      });

      console.log("✅ Single image uploaded successfully");

      res.json({
        success: true,
        message: "Image uploaded successfully",
        data: result,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload image",
        error: error.message,
      });
    }
  }
);

module.exports = router;
