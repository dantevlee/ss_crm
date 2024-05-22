require("dotenv").config();
const express = require("express");
const router = express.Router();
const { dbPromise } = require("../resources/config");
const { authenticateUser } = require("../middleware/authenticateUser");


router.post('/create-lead', authenticateUser, async(req, res) => {
  const db = await dbPromise;

  try{
    const userId = req.id;
    const LEAD_INDICATOR = 'Y'
    const { firstName, lastName, clientEmail, lastContactedAt, phoneNumber, socialMediaSource, socialMedia } = req.body;
    const lead = await db.query(
      'INSERT into "Clients"("user_id", "firstName", "lastName", "client_email", "last_contacted_at", "is_lead", "phone_number", "social_media_source", "social_media") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING*',
      [userId, firstName, lastName, clientEmail, lastContactedAt, LEAD_INDICATOR, phoneNumber, socialMediaSource, socialMedia]
    );
    res.json(lead[0]);
  } catch(error){
    console.error(error);
    res.status(500).json({
      message: "Internal Servor Error. Unable to create a lead.",
    });
  }
})

router.get('/leads', authenticateUser, async (req, res) => {
  const db = await dbPromise

  try{

    const userId = req.id;
    const LEAD_INDICATOR = 'Y'
    const leads = await db.query('SELECT "id", "user_id", "firstName", "lastName", "client_email", "last_contacted_at", "is_lead", "phone_number", "social_media_source", "social_media" FROM "Clients" WHERE "Clients"."user_id"= $1 AND "Clients"."is_lead"= $2', [userId, LEAD_INDICATOR])
    return res.json(leads)
  } catch(error){
    return res
      .status(500)
      .json({ message: "Internal Server Error. Unable To Retrieve Leads." });
  }
})

router.delete(
  `/delete/lead/:clientId`,
  authenticateUser,
  async (req, res) => {
    const db = await dbPromise;

    try {
      const clientId = req.params.clientId;
      const LEAD_INDICATOR = 'Y'
      await db.query(`DELETE FROM "Clients" WHERE "id" = $1 AND "is_lead" = $2`, [clientId, LEAD_INDICATOR]);
      return res.json({ message: "Lead Successfully Deleted." });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal Server Error. Unable To Delete Lead." });
    }
  }
);

module.exports = router;