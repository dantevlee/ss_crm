require("dotenv").config();
const express = require("express");
const multer = require("multer");
const router = express.Router();
const { dbPromise } = require("../resources/config");
const { authenticateUser } = require("../middleware/authenticateUser");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


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

module.exports = router