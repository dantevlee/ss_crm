require("dotenv").config();
const express = require("express");
const router = express.Router();
const { dbPromise } = require("../resources/config");
const { authenticateUser } = require("../middleware/authenticateUser");

router.post('/create/client-note', authenticateUser, async (req, res) => {
  const db = await dbPromise

  try{
    const {noteTitle, noteText} = req.body
    const client_id = req.query.client_id
    const note = await db.query(`INSERT into "Client_Notes"(client_id, text, title, version) VALUES($1, $2, $3, $4) RETURNING *`, [client_id, noteText, noteTitle, 0])
    res.json(note[0])
  } catch(error){
    console.error(error)
    res.status(500).json({message: "Internal Server Error. Unable To Create Note For Client."})
  }
})

router.get(`/clients/:client_id/notes`, authenticateUser, async (req, res) => {

  const db = await dbPromise

  const clientId = req.params.client_id
  const userId = req.id

  try{
    const client = await db.query(`SELECT "id", "firstName", "lastName", "client_email" FROM "Clients" WHERE "id" = $1 AND "user_id" = $2`, [clientId, userId])

    if (client.length === 0){
      return res.status(404).json({message: "Client not found, while trying to retrieve progress notes."})
    }

    const notes = await db.query(`SELECT * FROM "Client_Notes" WHERE "client_id" = $1 `,[clientId] )

    return res.json({client: client[0], notes: notes})

  } catch(error){
    console.error(error)
    res.status(500).json({message: "Internal Server Error. Unable to fetch notes by client."})
  }
})


router.delete(
  `/delete/note/:noteId`,
  authenticateUser,
  async (req, res) => {
    const db = await dbPromise;

    try {
      const noteId = req.params.noteId;
      await db.query(`DELETE FROM "Client_Notes" WHERE "id" = $1`, [noteId]);
      return res.json({ message: "Note Successfully Deleted." });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal Server Error. Unable To Delete Note." });
    }
  }
);

router.put("/update/note/:noteId", authenticateUser, async (req, res) => {
  const db = await dbPromise;

  try {
    const noteId = req.params.noteId;
    const { noteTitle, noteText } = req.body;
    const currentTime = new Date()
    const updatedNote = await db.query(
      'UPDATE "Client_Notes" SET "title"= $1, "text" = $2, "updated_at" = $3, "version" = $4 WHERE "id" = $5 RETURNING *',
      [noteTitle, noteText, currentTime, 1, noteId ]
    );
    res.json(updatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Servor Error. Unable to update client note.",
    });
  }
});

module.exports = router