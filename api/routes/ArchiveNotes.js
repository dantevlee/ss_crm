require("dotenv").config();
const express = require("express");
const router = express.Router();
const { dbPromise } = require("../resources/config");
const { authenticateUser } = require("../middleware/authenticateUser");

router.post('/create/archive-note', authenticateUser, async (req, res) => {
  const db = await dbPromise

  try{
    const {noteTitle, noteText} = req.body
    const archive_id = req.query.archive_id

    if (!noteTitle){
      return res.status(409).json({message: "Note title is required."})
    }

    if (!noteText){
      return res.status(409).json({message: "Note details are required."})
    }

    const note = await db.query(`INSERT into "Client_Notes"(archive_id, text, title, version) VALUES($1, $2, $3, $4) RETURNING *`, [archive_id, noteText, noteTitle, 0])
    res.json(note[0])
  } catch(error){
    console.error(error)
    res.status(500).json({message: "Internal Server Error. Unable To Create Note For Archive."})
  }
})

router.get(`/archives/:archive_id/notes`, authenticateUser, async (req, res) => {

  const db = await dbPromise

  const archive_id = req.params.archive_id
  const userId = req.id

  try{
    const archive = await db.query(`SELECT "id", "firstName", "lastName", "email" FROM "Archives" WHERE "id" = $1 AND "user_id" = $2`, [archive_id, userId])

    if (archive.length === 0){
      return res.status(404).json({message: "Archive not found, while trying to retrieve progress notes."})
    }

    const notes = await db.query(`SELECT * FROM "Client_Notes" WHERE "archive_id" = $1 `,[archive_id])

    return res.json({archive: archive[0], notes: notes})

  } catch(error){
    console.error(error)
    res.status(500).json({message: "Internal Server Error. Unable to fetch notes by archive."})
  }
})

module.exports = router