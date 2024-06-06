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

router.get(`/clients/:client_id/files`, authenticateUser, async (req, res) => {

  const db = await dbPromise

  const clientId = req.params.client_id
  const userId = req.id

  try{
    const client = await db.query(`SELECT "id", "firstName", "lastName", "client_email" FROM "Clients" WHERE "id" = $1 AND "user_id" = $2`, [clientId, userId])

    if (client.length === 0){
      return res.status(404).json({message: "Client not found, while trying to retrieve files."})
    }

    const files = await db.query(`SELECT * FROM "Files" WHERE "client_id" = $1 `,[clientId] )

    return res.json({client: client[0], files: files})

  } catch(error){
    console.error(error)
    res.status(500).json({message: "Internal Server Error. Unable to fetch files by client."})
  }
})

router.get('/clients/:client_id/files/:file_name', authenticateUser, async (req, res) => {
  const db = await dbPromise;
  const { client_id, file_name } = req.params;

  try {
    const file = await db.query(`SELECT * FROM "Files" WHERE "client_id" = $1 AND "file_name" = $2`, [client_id, file_name]);

    if (file.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const fileData = file[0].file_data;
    const mimeType = file[0].file_type === 'pdf' ? 'application/pdf' :
                     file[0].file_type === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
                     file[0].file_type === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/octet-stream';

    res.setHeader('Content-Disposition', `attachment; filename=${file_name}`);
    res.setHeader('Content-Type', mimeType);
    res.send(fileData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error. Unable to fetch file for download." });
  }
});



module.exports = router