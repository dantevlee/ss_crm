require("dotenv").config();
const express = require("express");
const router = express.Router();
const { dbPromise } = require("../resources/config");
const { authenticateUser } = require("../middleware/authenticateUser");

router.post('/create/lead-note', authenticateUser, async (req, res) => {
  const db = await dbPromise

  try{
    const {noteTitle, noteText} = req.body
    const lead_id = req.query.lead_id

    if (!noteTitle){
      return res.status(409).json({message: "Note title is required."})
    }

    if (!noteText){
      return res.status(409).json({message: "Note details are required."})
    }


    const note = await db.query(`INSERT into "Client_Notes"(lead_id, text, title, version) VALUES($1, $2, $3, $4) RETURNING *`, [lead_id, noteText, noteTitle, 0])
    return res.json(note[0])
  } catch(error){
    console.error(error)
    res.status(500).json({message: "Internal Server Error. Unable To Create Note For Lead."})
  }
})

router.get(`/leads/:lead_id/notes`, authenticateUser, async (req, res) => {

  const db = await dbPromise

  const lead_id = req.params.lead_id
  const userId = req.id

  try{
    const lead = await db.query(`SELECT "id", "firstName", "lastName", "lead_email" FROM "Leads" WHERE "id" = $1 AND "user_id" = $2`, [lead_id, userId])

    if (lead.length === 0){
      return res.status(404).json({message: "Lead not found, while trying to retrieve progress notes."})
    }

    const notes = await db.query(`SELECT * FROM "Client_Notes" WHERE "lead_id" = $1 `,[lead_id])

    return res.json({lead: lead[0], notes: notes})

  } catch(error){
    console.error(error)
    res.status(500).json({message: "Internal Server Error. Unable to fetch notes by leads."})
  }
})

module.exports = router