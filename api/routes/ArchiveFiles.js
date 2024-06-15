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
  "/upload/archive-file",
  authenticateUser,
  upload.single("file"),
  async (req, res) => {
    const db = await dbPromise;

    try {
      const fileName = req.file.originalname;
      const fileType = validateFileType(fileName);
      const fileData = req.file.buffer;

      const archive_id = req.query.archive_id;

      const fileNameExists = await db.query(
        `SELECT "file_name" FROM "Files" WHERE "Files"."file_name" = $1 AND "Files"."archive_id" = $2`,
        [fileName, archive_id]
      );

      if (fileNameExists.length > 0) {
        return res
          .status(409)
          .json({ error: "Archive cannot have two files with the same name." });
      } else {
        const file = await db.query(
          `INSERT INTO "Files" ("archive_id", "file_name", "file_type", "file_data")
        VALUES ($1, $2, $3, $4) RETURNING *`,
          [archive_id, fileName, fileType, fileData]
        );
        res.json(file[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Server Error. Error uploading file for archive.",
      });
    }
  }
);

router.get(`/archives/:archive_id/files`, authenticateUser, async (req, res) => {
  const db = await dbPromise;

  const archiveId = req.params.archive_id
  const userId = req.id;

  try {
    const archive = await db.query(
      `SELECT "id", "firstName", "lastName", "email" FROM "Archives" WHERE "id" = $1 AND "user_id" = $2`,
      [archiveId, userId]
    );

    if (archive.length === 0) {
      return res
        .status(404)
        .json({ message: "Archive not found, while trying to retrieve files." });
    }

    const files = await db.query(
      `SELECT * FROM "Files" WHERE "archive_id" = $1 `,
      [archiveId]
    );

    return res.json({ archive: archive[0], files: files });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error. Unable to fetch files by archive.",
    });
  }
});

router.get(
  "/archives/:archive_id/files/:file_name",
  authenticateUser,
  async (req, res) => {
    const db = await dbPromise;
    const { archive_id, file_name } = req.params;

    try {
      const file = await db.query(
        `SELECT * FROM "Files" WHERE "archive_id" = $1 AND "file_name" = $2`,
        [archive_id, file_name]
      );

      if (file.length === 0) {
        return res.status(404).json({ message: "File not found" });
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


module.exports = router