require("dotenv").config();
const express = require("express");
const multer = require("multer");
const router = express.Router();
const { dbPromise } = require("../resources/config");
const { authenticateUser } = require("../middleware/authenticateUser");
const { validateFileType } = require("../middleware/ValidateFileType")


router.get(`/leads/:lead_id/files`, authenticateUser, async (req, res) => {
  const db = await dbPromise;

  const leadId = req.params.lead_id;
  const userId = req.id;

  try {
    const lead = await db.query(
      `SELECT "id", "firstName", "lastName", "lead_email" FROM "Leads" WHERE "id" = $1 AND "user_id" = $2`,
      [leadId, userId]
    );

    if (lead.length === 0) {
      return res
        .status(404)
        .json({ message: "Lead not found, while trying to retrieve files." });
    }

    const files = await db.query(
      `SELECT * FROM "Files" WHERE "lead_id" = $1 `,
      [leadId]
    );

    return res.json({ lead: lead[0], files: files });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error. Unable to fetch files by lead.",
    });
  }
});

module.exports = router