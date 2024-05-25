require("dotenv").config();
const express = require("express");
const router = express.Router();
const { dbPromise } = require("../resources/config");
const { authenticateUser } = require("../middleware/authenticateUser");

router.get("/clients/archived", authenticateUser, async (req, res) => {
  const db = await dbPromise;

  try {
    const userId = req.id;
    const getArchivedClients = await db.query(
      'SELECT * FROM "Archives" WHERE "Archives"."user_id"= $1',
      [userId]
    );
    return res.json(getArchivedClients);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        message: "Internal Server Error. Unable To Retrieved Archived Clients.",
      });
  }
});

module.exports = router;
