require("dotenv").config();
const express = require("express");
const multer = require('multer');
const router = express.Router();
const { dbPromise } = require("../resources/config");
const { authenticateUser } = require("../middleware/authenticateUser");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

function getFileType(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (['xls', 'xlsx'].includes(ext)) return 'excel';
  if (['doc', 'docx'].includes(ext)) return 'docx';
  throw new Error('Unsupported file type');
}

router.post('/upload/client-file', authenticateUser, upload.single('file'), async (req, res) => {
  const db = await dbPromise

  try{
      const fileName = req.file.originalname;
      const fileType = getFileType(fileName);
      const fileData = req.file.buffer;

    const client_id = req.query.client_id
    const file = await db.query(`INSERT INTO "Files" ("client_id", "file_name", "file_type", "file_data")
            VALUES ($1, $2, $3, $4) RETURNING *`, [client_id, fileName, fileType, fileData])
    res.json(file[0])

  } catch(error){
    console.error(error)
    res.status(500).json({message: "Internal Server Error. Error uploading file for client."})
  }
})

module.exports = router