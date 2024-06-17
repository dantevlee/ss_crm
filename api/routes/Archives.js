require("dotenv").config();
const express = require("express");
const router = express.Router();
const { dbPromise } = require("../resources/config");
const { authenticateUser } = require("../middleware/authenticateUser");

router.get("/clients/archived", authenticateUser, async (req, res) => {
  const db = await dbPromise;

  try {
    const userId = req.id;
    const getArchivedClients = await db.query(
      'SELECT * FROM "Archives" WHERE "Archives"."user_id"= $1',
      [userId]
    );
    return res.json(getArchivedClients);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error. Unable To Retrieved Archived Clients.",
    });
  }
});

router.put("/update/archive/:archiveId", authenticateUser, async (req, res) => {
  const db = await dbPromise;

  try {
    const userId = req.id;
    const archiveId = req.params.archiveId;
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      socialMediaSource,
      socialMedia,
      lastActiveDate,
    } = req.body;
    const updatedArchive = await db.query(
      'UPDATE "Archives" SET "firstName" = $1, "lastName" = $2, "email" = $3, "phone_number" = $4, "social_media_source" = $5, "soical_media" = $6, "last_active_date" = $7 WHERE "id" = $8 AND "user_id" = $9 RETURNING*',
      [
        firstName,
        lastName,
        email,
        phoneNumber,
        socialMediaSource,
        socialMedia,
        lastActiveDate,
        archiveId,
        userId,
      ]
    );
    res.json(updatedArchive[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error. Could not update Archive." });
  }
});

router.delete(
  `/delete/archive/:archiveId`,
  authenticateUser,
  async (req, res) => {
    const db = await dbPromise;

    try {
      const archiveId = req.params.archiveId;
      const userId = req.id;

      await db.query(`DELETE FROM "Client_Notes" WHERE "archive_id" = $1`, [
        archiveId,
      ]);

      await db.query(`DELETE FROM "Files" WHERE "archive_id" = $1`, [
        archiveId,
      ]);

      await db.query(
        `DELETE FROM "Archives" WHERE "id" = $1 AND "user_id" = $2`,
        [archiveId, userId]
      );
      return res.json({ message: "Client Successfully Deleted." });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal Server Error. Unable To Delete Archive." });
    }
  }
);

router.post(
  "/archived/restore/client/:archiveId",
  authenticateUser,
  async (req, res) => {
    const db = await dbPromise;

    try {
      const userId = req.id;
      const archiveId = req.params.archiveId;
      const {
        firstName,
        lastName,
        clientEmail,
        startDate,
        endDate,
        phoneNumber,
        socialMediaSource,
        socialMedia,
      } = req.body;
      const client = await db.query(
        'INSERT into "Clients"("user_id", "firstName", "lastName", "client_email", "start_date", "end_date", "phone_number", "social_media_source", "social_media") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING*',
        [
          userId,
          firstName,
          lastName,
          clientEmail,
          startDate,
          endDate,
          phoneNumber,
          socialMediaSource,
          socialMedia,
        ]
      );
      const archiveNoteId = await db.query(
        `SELECT "archive_id" from "Client_Notes" WHERE archive_id = $1`,
        [archiveId]
      );

      const isAllSameArchiveId = archiveNoteId.every((note, _, array) =>
        array.every((otherNote) => note.archive_id === otherNote.archive_id)
      );

      const archiveFileId = await db.query(
        `SELECT "archive_id" from "Files" WHERE archive_id = $1`,
        [archiveId]
      );

      const isAllSameArchiveIdFiles = archiveFileId.every((file, _, array) =>
        array.every((otherFile) => file.archive_id === otherFile.archive_id)
      );

      if (
        archiveNoteId.length > 0 &&
        isAllSameArchiveId &&
        archiveFileId.length > 0 &&
        isAllSameArchiveIdFiles
      ) {
        const updatedNotes = await db.query(
          `UPDATE "Client_Notes" SET "archive_id" = $1, "client_id"= $2 WHERE "archive_id" = $3 RETURNING *`,
          [null, client[0].id, archiveId]
        );

        const updatedFiles = await db.query(
          `UPDATE "Files" SET "client_id" = $1, "archive_id"= $2 WHERE "archive_id" = $3 RETURNING *`,
          [client[0].id, null, archiveId]
        );

        res.json({
          client: client[0],
          notes: updatedNotes,
          files: updatedFiles,
        });
      } else if (archiveNoteId.length > 0 && isAllSameArchiveId) {
        const updatedNotes = await db.query(
          `UPDATE "Client_Notes" SET "archive_id" = $1, "client_id"= $2 WHERE "archive_id" = $3 RETURNING *`,
          [null, client[0].id, archiveId]
        );
        res.json({ client: client[0], notes: updatedNotes });
      } else if (archiveFileId.length > 0 && isAllSameArchiveIdFiles) {
        const updatedFiles = await db.query(
          `UPDATE "Files" SET "client_id" = $1, "archive_id"= $2 WHERE "archive_id" = $3 RETURNING *`,
          [client[0].id, null, archiveId]
        );
        res.json({ client: client[0], files: updatedFiles });
      } else {
        res.json(client[0]);
      }

      if (client.length === 1) {
        await db.query(
          'DELETE FROM "Archives" WHERE "id" = $1 AND "user_id" = $2',
          [archiveId, userId]
        );
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Servor Error. Unable to restore as Client.",
      });
    }
  }
);

router.post(
  "/archived/restore/lead/:archiveId",
  authenticateUser,
  async (req, res) => {
    const db = await dbPromise;

    try {
      const userId = req.id;
      const archiveId = req.params.archiveId;
      const {
        firstName,
        lastName,
        leadEmail,
        lastContactedAt,
        phoneNumber,
        socialMediaSource,
        soicalMedia,
      } = req.body;
      const lead = await db.query(
        'INSERT into "Leads"("user_id", "firstName", "lastName", "lead_email", "last_contacted_at", "phone_number", "social_media_source", "soical_media") VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING*',
        [
          userId,
          firstName,
          lastName,
          leadEmail,
          lastContactedAt,
          phoneNumber,
          socialMediaSource,
          soicalMedia,
        ]
      );
      const archiveNoteId = await db.query(
        `SELECT "archive_id" from "Client_Notes" WHERE archive_id = $1`,
        [archiveId]
      );

      const isAllSameArchiveId = archiveNoteId.every((note, _, array) =>
        array.every((otherNote) => note.archive_id === otherNote.archive_id)
      );

      const archiveFileId = await db.query(
        `SELECT "archive_id" from "Files" WHERE archive_id = $1`,
        [archiveId]
      );

      const isAllSameArchiveIdFiles = archiveFileId.every((file, _, array) =>
        array.every((otherFile) => file.archive_id === otherFile.archive_id)
      );

      if (
        archiveNoteId.length > 0 &&
        isAllSameArchiveId &&
        archiveFileId.length > 0 &&
        isAllSameArchiveIdFiles
      ) {
        const updatedNotes = await db.query(
          `UPDATE "Client_Notes" SET "archive_id" = $1, "lead_id"= $2 WHERE "archive_id" = $3 RETURNING *`,
          [null, lead[0].id, archiveId]
        );

        const updatedFiles = await db.query(
          `UPDATE "Files" SET "lead_id" = $1, "archive_id"= $2 WHERE "archive_id" = $3 RETURNING *`,
          [lead[0].id, null, archiveId]
        );

        res.json({
          lead: lead[0],
          notes: updatedNotes,
          files: updatedFiles,
        });
      } else if (archiveNoteId.length > 0 && isAllSameArchiveId) {
        const updatedNotes = await db.query(
          `UPDATE "Client_Notes" SET "archive_id" = $1, "lead_id"= $2 WHERE "archive_id" = $3 RETURNING *`,
          [null, lead[0].id, archiveId]
        );

        res.json({ lead: lead[0], notes: updatedNotes });
      } else if (archiveFileId.length > 0 && isAllSameArchiveIdFiles) {
        const updatedFiles = await db.query(
          `UPDATE "Files" SET "lead_id" = $1, "archive_id"= $2 WHERE "archive_id" = $3 RETURNING *`,
          [lead[0].id, null, archiveId]
        );
        res.json({ lead: lead[0], files: updatedFiles });
      } else {
        res.json(lead[0]);
      }

      if (lead.length >= 1) {
        await db.query(
          'DELETE FROM "Archives" WHERE "id" = $1 AND "user_id" = $2',
          [archiveId, userId]
        );
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Servor Error. Unable to restore as Lead.",
      });
    }
  }
);

module.exports = router;
