require("dotenv").config();
const express = require("express");
const router = express.Router();
const { dbPromise } = require("../resources/config");
const { authenticateUser } = require("../middleware/authenticateUser");

router.post("/create-client", authenticateUser, async (req, res) => {
  const db = await dbPromise;

  try {
    const userId = req.id;
    const { firstName, lastName, clientEmail, startDate, endDate, phoneNumber, socialMediaSource, socialMedia } = req.body;
    const client = await db.query(
      'INSERT into "Clients"("user_id", "firstName", "lastName", "client_email", "start_date", "end_date", "phone_number", "social_media_source", "social_media") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING*',
      [userId, firstName, lastName, clientEmail, startDate, endDate, phoneNumber, socialMediaSource, socialMedia]
    );

    res.json(client[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Servor Error. Unable to create a client.",
    });
  }
});

router.get("/clients", authenticateUser, async (req, res) => {
  const db = await dbPromise;
  try {
    const userId = req.id;
    const getAllClientsByUser = await db.query(
      'SELECT * FROM "Clients" WHERE "Clients"."user_id"= $1',
      [userId]
    );
    return res.json(getAllClientsByUser);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error. Unable To Retrieve Clients." });
  }
});

router.delete(
  `/delete/client/:clientId`,
  authenticateUser,
  async (req, res) => {
    const db = await dbPromise;

    try {
      const clientId = req.params.clientId;
      const userId = req.id;
      await db.query(
        `DELETE FROM "Clients" WHERE "id" = $1 and "user_id" = $2`,
        [clientId, userId]
      );
      return res.json({ message: "Client Successfully Deleted." });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal Server Error. Unable To Delete Client." });
    }
  }
);

router.put("/update/client/:clientId", authenticateUser, async (req, res) => {
  const db = await dbPromise;

  try {
    const clientId = req.params.clientId;
    const userId = req.id;
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
    const updatedClient = await db.query(
      'UPDATE "Clients" SET "firstName" = $1, "lastName" = $2, "client_email" = $3, "start_date" = $4, "end_date" = $5, "phone_number" = $6, "social_media_source" = $7, "social_media" = $8 WHERE "id" = $9 AND "user_id" = $10 RETURNING *',
      [
        firstName,
        lastName,
        clientEmail,
        startDate,
        endDate,
        phoneNumber,
        socialMediaSource,
        socialMedia,
        clientId,
        userId
      ]
    );
    res.json(updatedClient[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Servor Error. Unable to update client details.",
    });
  }
});

router.post("/archive/client/:clientId", authenticateUser, async (req, res) => {
  const db = await dbPromise;

  try {
    const userId = req.id;
    const clientId = req.params.clientId;
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      socialMediaSource,
      socialMedia,
      lastActiveDate,
    } = req.body;
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
    res.json(archivedClient[0]);
    if (archivedClient.length === 1) {
      await db.query('DELETE FROM "Clients" WHERE "id" = $1 AND user_id = $2', [
        clientId,
        userId,
      ]);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error. Could not Archive Client" });
  }
});

module.exports = router;
