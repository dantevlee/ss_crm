require("dotenv").config();
const express = require("express");
const router = express.Router();
const { dbPromise } = require("../resources/config");
const { authenticateUser } = require("../middleware/authenticateUser");

router.post("/create-lead", authenticateUser, async (req, res) => {
  const db = await dbPromise;

  try {
    const userId = req.id;
    const {
      firstName,
      lastName,
      leadEmail,
      lastContactedAt,
      phoneNumber,
      socialMediaSource,
      socialMedia,
    } = req.body;

    if (!firstName || !lastName || !leadEmail) {
      return res
        .status(409)
        .json({
          message:
            "Please ensure client first, last name and e-mail is entered.",
        });
    }

    if (!lastContactedAt) {
      return res.status(409).json({ message: "Error: Missing date last contacted." });
    }

    if (socialMediaSource && !socialMedia) {
        return res
          .status(409)
          .json({ message: "Error: Missing Social Media Handle." });
    }
  
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
          socialMedia,
        ]
      );
      return res.json(lead[0]);
    }
  
  catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Servor Error. Unable to create a lead.",
    });
  }
});

router.get("/leads", authenticateUser, async (req, res) => {
  const db = await dbPromise;

  try {
    const userId = req.id;
    const leads = await db.query(
      'SELECT * FROM "Leads" WHERE "Leads"."user_id" = $1 ',
      [userId]
    );
    return res.json(leads);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error. Unable To Retrieve Leads." });
  }
});

router.delete(`/delete/lead/:leadId`, authenticateUser, async (req, res) => {
  const db = await dbPromise;

  try {
    const leadId = req.params.leadId;
    const userId = req.id;

    await db.query(`DELETE FROM "Client_Notes" WHERE "lead_id" = $1`, [leadId]);

    await db.query(`DELETE FROM "Files" WHERE "lead_id" = $1`, [leadId]);

    await db.query(`DELETE FROM "Leads" WHERE "id" = $1 AND "user_id" = $2`, [
      leadId,
      userId,
    ]);
    return res.json({ message: "Lead Successfully Deleted." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error. Unable To Delete Lead." });
  }
});

router.put("/update/lead/:leadId", authenticateUser, async (req, res) => {
  const db = await dbPromise;

  try {
    const leadId = req.params.leadId;
    const userId = req.id;
    const {
      firstName,
      lastName,
      leadEmail,
      lastContactedAt,
      phoneNumber,
      socialMediaSource,
      socialMedia,
    } = req.body;

    if (!firstName || !lastName || !leadEmail) {
      return res
        .status(409)
        .json({
          message:
            "Please ensure client first, last name and e-mail is entered.",
        });
    }

    if (!lastContactedAt) {
      return res.status(409).json({ message: "Error: Missing date last contacted." });
    }

    if (socialMediaSource && !socialMedia) {
        return res
          .status(409)
          .json({ message: "Error: Missing Social Media Handle." });
    }

    const updatedLead = await db.query(
      'UPDATE "Leads" SET "firstName" = $1, "lastName" = $2, "lead_email" = $3, "last_contacted_at" = $4, "phone_number" = $5, "social_media_source" = $6, "soical_media" = $7 WHERE "id" = $8 AND "user_id"= $9 RETURNING *',
      [
        firstName,
        lastName,
        leadEmail,
        lastContactedAt,
        phoneNumber,
        socialMediaSource,
        socialMedia,
        leadId,
        userId,
      ]
    );

    return res.json(updatedLead[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error. Unable to update lead details",
    });
  }
});

router.post("/archive/lead/:leadId", authenticateUser, async (req, res) => {
  const db = await dbPromise;

  try {
    const userId = req.id;
    const leadId = req.params.leadId;
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      socialMediaSource,
      socialMedia,
      lastActiveDate,
    } = req.body;


    if (firstName.trim() == "" || lastName.trim() == "" || email.trim() == "") {
      return res
        .status(409)
        .json({
          message:
            "Please ensure client first, last name and e-mail is entered.",
        });
    }

    if (socialMediaSource) {
      if (!socialMedia) {
        return res
          .status(409)
          .json({ message: "Error: Missing Social Media Handle." });
      }
    } 

    if (lastActiveDate.trim() === "") {
      return res.status(409).json({ message: "Error: Missing End Date." });
    }

    const archivedClient = await db.query(
      'INSERT into "Archives"("user_id", "firstName", "lastName", "email", "phone_number", "social_media_source", "soical_media", "last_active_date") VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING*',
      [
        userId,
        firstName,
        lastName,
        email,
        phoneNumber,
        socialMediaSource,
        socialMedia,
        lastActiveDate,
      ]
    );

    const leadNoteId = await db.query(
      `SELECT "lead_id" from "Client_Notes" WHERE lead_id = $1`,
      [leadId]
    );

    const isAllSameLeadId = leadNoteId.every((note, _, array) =>
      array.every((otherNote) => note.lead_id === otherNote.lead_id)
    );

    const leadFilesId = await db.query(
      `SELECT "lead_id" from "Files" WHERE lead_id = $1`,
      [leadId]
    );

    const isAllSameLeadIdFiles = leadFilesId.every((file, _, array) =>
      array.every((otherFile) => file.lead_id === otherFile.lead_id)
    );


    if (
      leadNoteId.length > 0 &&
      isAllSameLeadId &&
      isAllSameLeadIdFiles &&
      leadFilesId.length > 0
    ) {
      const updatedNotes = await db.query(
        `UPDATE "Client_Notes" SET "archive_id" = $1, "lead_id"= $2 WHERE "lead_id" = $3 RETURNING *`,
        [archivedClient[0].id, null, leadId]
      );

      const updatedFiles = await db.query(
        `UPDATE "Files" SET "archive_id" = $1, "lead_id"= $2 WHERE "lead_id" = $3 RETURNING *`,
        [archivedClient[0].id, null, leadId]
      );

      res.json({
        archive: archivedClient[0],
        notes: updatedNotes,
        files: updatedFiles,
      });
    } else if (leadFilesId.length > 0 && isAllSameLeadIdFiles) {
      const updatedFiles = await db.query(
        `UPDATE "Files" SET "archive_id" = $1, "lead_id"= $2 WHERE "lead_id" = $3 RETURNING *`,
        [archivedClient[0].id, null, leadId]
      );
      res.json({ archive: archivedClient[0], files: updatedFiles });
    } else if (leadNoteId.length > 0 && isAllSameLeadId) {
      const updatedNotes = await db.query(
        `UPDATE "Client_Notes" SET "archive_id" = $1, "lead_id"= $2 WHERE "lead_id" = $3 RETURNING *`,
        [archivedClient[0].id, null, leadId]
      );
      res.json({ archive: archivedClient[0], notes: updatedNotes });
    } else {
      res.json({ archive: archivedClient[0] });
    }

    if (archivedClient.length === 1) {
      await db.query('DELETE FROM "Leads" WHERE "id" = $1 AND user_id = $2', [
        leadId,
        userId,
      ]);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error. Could not Archive Lead." });
  }
});

router.post(
  "/lead/convert/client/:leadId",
  authenticateUser,
  async (req, res) => {
    const db = await dbPromise;

    try {
      const userId = req.id;
      const leadId = req.params.leadId;
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

      if (!clientEmail) {
        return res
          .status(409)
          .json({
            message:
              "Please ensure e-mail is entered.",
          });
      }
  
      if (!startDate) {
        return res.status(409).json({ message: "Error: Missing Start Date." });
      }
  
      if (!endDate) {
        return res.status(409).json({ message: "Error: Missing End Date." });
      }

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

      const leadNoteId = await db.query(
        `SELECT "lead_id" from "Client_Notes" WHERE lead_id = $1`,
        [leadId]
      );

      const isAllSameLeadId = leadNoteId.every((note, _, array) =>
        array.every((otherNote) => note.lead_id === otherNote.lead_id)
      );

      const leadFileId = await db.query(
        `SELECT "lead_id" from "Files" WHERE lead_id = $1`,
        [leadId]
      );

      const isAllSameLeadIdFiles = leadFileId.every((file, _, array) =>
        array.every((otherFile) => file.lead_id === otherFile.lead_id)
      );

      if (
        leadNoteId.length > 0 &&
        isAllSameLeadId &&
        leadFileId.length > 0 &&
        isAllSameLeadIdFiles
      ) {
        const updatedNotes = await db.query(
          `UPDATE "Client_Notes" SET "lead_id" = $1, "client_id"= $2 WHERE "lead_id" = $3 RETURNING *`,
          [null, client[0].id, leadId]
        );

        const updatedFiles = await db.query(
          `UPDATE "Files" SET "client_id" = $1, "lead_id"= $2 WHERE "lead_id" = $3 RETURNING *`,
          [client[0].id, null, leadId]
        );

        res.json({
          client: client[0],
          notes: updatedNotes,
          files: updatedFiles,
        });
      } else if (leadNoteId.length > 0 && isAllSameLeadId) {
        const updatedNotes = await db.query(
          `UPDATE "Client_Notes" SET "lead_id" = $1, "client_id"= $2 WHERE "lead_id" = $3 RETURNING *`,
          [null, client[0].id, leadId]
        );
        res.json({ client: client[0], notes: updatedNotes });
      } else if (leadFileId.length > 0 && isAllSameLeadIdFiles) {
        const updatedFiles = await db.query(
          `UPDATE "Files" SET "client_id" = $1, "lead_id"= $2 WHERE "lead_id" = $3 RETURNING *`,
          [client[0].id, null, leadId]
        );
        res.json({ client: client[0], files: updatedFiles });
      } else {
        res.json(client[0]);
      }
  
      if (client.length === 1) {
        await db.query('DELETE FROM "Leads" WHERE "id" = $1 AND user_id = $2', [
          leadId,
          userId,
        ]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Servor Error. Unable to convert lead to client.",
      });
    }
  }
);

module.exports = router;
