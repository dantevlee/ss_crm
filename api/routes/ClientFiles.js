require("dotenv").config();
const express = require("express");
const multer = require("multer");
const router = express.Router();
const { dbPromise } = require("../resources/config");
const { authenticateUser } = require("../middleware/authenticateUser");
const { validateFileType } = require("../middleware/ValidateFileType")

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/upload/client-file",
  authenticateUser,
  upload.single("file"),
  async (req, res) => {
    const db = await dbPromise;

    try {

      if(!req.file) {
        return res.status(404).json({message: "Please select a file to be uploaded."})
      }

      const fileName = req.file.originalname;
      const fileType = validateFileType(fileName);
      const fileData = req.file.buffer;

      const client_id = req.query.client_id;

      if (!fileType){
        return res.status(404).json({message: "Unsupported file type. File must be in pdf, excel, or docx format"})
      }

      const fileNameExists = await db.query(
        `SELECT "file_name" FROM "Files" WHERE "Files"."file_name" = $1 AND "Files"."client_id" = $2`,
        [fileName, client_id]
      );

      if (fileNameExists.length > 0) {
        return res
          .status(409)
          .json({ message: "Client cannot have two files with the same name." });
      } else {
        const file = await db.query(
          `INSERT INTO "Files" ("client_id", "file_name", "file_type", "file_data")
        VALUES ($1, $2, $3, $4) RETURNING *`,
          [client_id, fileName, fileType, fileData]
        );
        res.json(file[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Server Error. Error uploading file for client.",
      });
    }
  }
);

router.get(`/clients/:client_id/files`, authenticateUser, async (req, res) => {
  const db = await dbPromise;

  const clientId = req.params.client_id;
  const userId = req.id;

  try {
    const client = await db.query(
      `SELECT "id", "firstName", "lastName", "client_email" FROM "Clients" WHERE "id" = $1 AND "user_id" = $2`,
      [clientId, userId]
    );

    if (client.length === 0) {
      return res
        .status(404)
        .json({ message: "Client not found, while trying to retrieve files." });
    }

    const files = await db.query(
      `SELECT * FROM "Files" WHERE "client_id" = $1 `,
      [clientId]
    );

    return res.json({ client: client[0], files: files });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error. Unable to fetch files by client.",
    });
  }
});

router.get(
  "/clients/:client_id/files/:file_name",
  authenticateUser,
  async (req, res) => {
    const db = await dbPromise;
    const { client_id, file_name } = req.params;

    try {
      const file = await db.query(
        `SELECT * FROM "Files" WHERE "client_id" = $1 AND "file_name" = $2`,
        [client_id, file_name]
      );

      if (file.length === 0) {
        return res.status(404).json({ message: "Could not locate file to download." });
      }

      const fileData = file[0].file_data;
      const mimeType =
        file[0].file_type === "pdf"
          ? "application/pdf"
          : file[0].file_type === "excel"
          ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          : file[0].file_type === "docx"
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : "application/octet-stream";

      res.setHeader("Content-Disposition", `attachment; filename=${file_name}`);
      res.setHeader("Content-Type", mimeType);
      res.send(fileData);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Server Error. Unable to fetch file for download.",
      });
    }
  }
);

router.delete(`/delete/file/:fileId`, authenticateUser, async (req, res) => {
  const db = await dbPromise;

  try {
    const fileId = req.params.fileId;
    await db.query(`DELETE FROM "Files" WHERE "id" = $1`, [fileId]);
    return res.json({ message: "Client File Successfully Deleted." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        message: "Internal Server Error. Unable To Delete Client File.",
      });
  }
});

module.exports = router;
