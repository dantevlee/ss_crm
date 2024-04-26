require("dotenv").config();
const express = require("express");
const router = express.Router();
const { dbPromise } = require("../resources/config");
const { authenticateUser } = require("../middleware/authenticateUser");

router.post('/create/note', authenticateUser, async (req, res) => {
  const db = await dbPromise

  try{
    const {notes, noteTimeStamp} = req.body
  } catch(error){
    console.error(error)
    res.status(500).json({message: "Internal Server Error. Unable To Create Note."})
  }
})

module.exports = router