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
    const { firstName, lastName, clientEmail, startDate, endDate } = req.body;
    const lead = await db.query(
      'INSERT into "Clients"("user_id", "firstName", "lastName", "client_email", "start_date", "end_date", "is_lead") VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING*',
      [userId, firstName, lastName, clientEmail, startDate, endDate, LEAD_INDICATOR]
    );
  } catch(error){
    console.error(error);
    res.status(500).json({
      message: "Internal Servor Error. Unable to create a lead.",
    });
  }
})

module.exports = router;