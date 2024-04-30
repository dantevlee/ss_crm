require("dotenv").config();
const express = require("express");
const router = express.Router();
const { dbPromise } = require("../resources/config");
const { authenticateUser } = require("../middleware/authenticateUser");

router.post('/create/note', authenticateUser, async (req, res) => {
  const db = await dbPromise

  try{
    const {noteText} = req.body
    const client_id = req.query.client_id
    const note = await db.query(`INSERT into "Client_Notes"(client_id, text) VALUES($1, $2) RETURNING *`, [client_id, noteText])
    res.json(note[0])
  } catch(error){
    console.error(error)
    res.status(500).json({message: "Internal Server Error. Unable To Create Note."})
  }
})

router.get("/notes", authenticateUser, async (req, res) => {
  const db = await dbPromise;
  try {
    const client_id = req.query.client_id
    const getAllNotesByClient = await db.query(
      'SELECT * FROM "Client_Notes" WHERE "Client_Notes"."client_id"= $1',
      [client_id]
    );
    return res.json(getAllNotesByClient);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error. Unable To Retrieve Client Notes." });
  }
});
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
    const { noteText } = req.body;
    const currentTime = new Date()
    const updatedNote = await db.query(
      'UPDATE "Client_Notes" SET "text" = $1, "updated_at" = $2 WHERE "id" = $3 RETURNING *',
      [noteText, currentTime, noteId]
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