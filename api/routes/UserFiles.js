require("dotenv").config();
const express = require("express");
const multer = require("multer");
const router = express.Router();
const { dbPromise } = require("../resources/config");
const { authenticateUser } = require("../middleware/authenticateUser");
const { validateFileType } = require("../middleware/ValidateFileType")

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/upload/user-file",
  authenticateUser,
  upload.single("file"),
  async (req, res) => {
    const db = await dbPromise;

    try {

      if(!req.file) {
        return res.status(400).json({message: "Please select a file to be uploaded."})
      }

      const fileName = req.file.originalname;
      const fileType = validateFileType(fileName);
      const fileData = req.file.buffer;

      const userId = req.id;

      if (!fileType){
        return res.status(400).json({message: "Unsupported file type. File must be in pdf, excel, or docx format"})
      }

      const fileNameExists = await db.query(
        `SELECT "file_name" FROM "Files" WHERE "Files"."file_name" = $1 AND "Files"."user_id" = $2`,
        [fileName, userId]
      );

      if (fileNameExists.length > 0) {
        return res
          .status(409)
          .json({ message: "Users cannot have two files with the same name." });
      } else {
        const file = await db.query(
          `INSERT INTO "Files" ("user_id", "file_name", "file_type", "file_data")
        VALUES ($1, $2, $3, $4) RETURNING *`,
          [userId, fileName, fileType, fileData]
        );
        res.json(file[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Server Error. Error uploading file for user.",
      });
    }
  }
);

router.get(`/users/files`, authenticateUser, async (req, res) => {
  const db = await dbPromise;

  const userId = req.id;

  try {

    const files = await db.query(
      `SELECT * FROM "Files" WHERE "user_id" = $1 `,
      [userId]
    );

    return res.json({ files: files });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error. Unable to fetch files for current user.",
    });
  }
});

router.get(
  "/users/files/:file_name",
  authenticateUser,
  async (req, res) => {
    const db = await dbPromise;
    const { file_name } = req.params;
    const userId = req.id

    try {
      const file = await db.query(
        `SELECT * FROM "Files" WHERE "user_id" = $1 AND "file_name" = $2`,
        [userId, file_name]
      );

      if (file.length === 0) {
        return res.status(404).json({ message: "Could not locate file to download." });
      }

      const fileData = file[0].file_data;
      const mimeType =
        file[0].file_type === "pdf"
          ? "application/pdf"
          : file[0].file_type === "excel"
          ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          : file[0].file_type === "docx"
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : "application/octet-stream";

      res.setHeader("Content-Disposition", `attachment; filename=${file_name}`);
      res.setHeader("Content-Type", mimeType);
      res.send(fileData);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Server Error. Unable to fetch file for download.",
      });
    }
  }
);


module.exports = router;
