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
    res.json(lead[0]);
  } catch (error) {
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

router.delete(`/delete/lead/:clientId`, authenticateUser, async (req, res) => {
  const db = await dbPromise;

  try {
    const clientId = req.params.clientId;
    const LEAD_INDICATOR = "Y";
    await db.query(`DELETE FROM "Clients" WHERE "id" = $1 AND "is_lead" = $2`, [
      clientId,
      LEAD_INDICATOR,
    ]);
    return res.json({ message: "Lead Successfully Deleted." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error. Unable To Delete Lead." });
  }
});

router.put("/update/lead/:clientId", authenticateUser, async (req, res) => {
  const db = await dbPromise;

  try {
    const clientId = req.params.clientId;
    const LEAD_INDICATOR = "Y";
    const {
      firstName,
      lastName,
      clientEmail,
      lastContactedAt,
      phoneNumber,
      socialMediaSource,
      socialMedia,
    } = req.body;
    const updatedLead = await db.query(
      'UPDATE "Clients" SET "firstName" = $1, "lastName" = $2, "client_email" = $3, "last_contacted_at" = $4, "phone_number" = $5, "social_media_source" = $6, "social_media" = $7 WHERE "id" = $8 AND "is_lead"= $9 RETURNING *',
      [
        firstName,
        lastName,
        clientEmail,
        lastContactedAt,
        phoneNumber,
        socialMediaSource,
        socialMedia,
        clientId,
        LEAD_INDICATOR,
      ]
    );

    res.json(updatedLead[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        message: "Internal Server Error. Unable to update lead details",
      });
  }
});

module.exports = router;
