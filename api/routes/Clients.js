require("dotenv").config();
const express = require("express");
const router = express.Router();
const { dbPromise } = require("../resources/config");
const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      status: "Unauthorized",
      message: "You are not authorized to perform this action.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
    req.id = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

router.post("/create-client", authenticateUser, async (req, res) => {
  const db = await dbPromise;

  try {
    const userId = req.id;
    const { firstName, lastName, clientEmail, isLead } = req.body;
    const client = await db.query(
      'INSERT into "Clients"("user_id", "firstName", "lastName", "client_email", "is_lead") VALUES($1, $2, $3, $4, $5) RETURNING*',
      [userId, firstName, lastName, clientEmail, isLead]
    );

    res.json(client[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Servor Error. Unable to create a client.",
    });
  }
});

router.get("/clients", authenticateUser, async (req, res) => {
  const db = await dbPromise;
  try {
    const userId = req.id;
    const getAllClientsByUser = await db.query(
      'SELECT * FROM "Clients" WHERE "Clients"."user_id"= $1',
      [userId]
    );
    return res.json(getAllClientsByUser);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error. Unable To Retrieve Clients." });
  }
});

router.delete(
  `/delete/client/:clientId`,
  authenticateUser,
  async (req, res) => {
    const db = await dbPromise;

    try {
      const clientId = req.params.clientId;
      await db.query(`DELETE FROM "Clients" WHERE "id" = $1`, [clientId]);
      return res.json({ message: "Client Successfully Deleted." });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal Server Error. Unable To Delete Client." });
    }
  }
);

router.put('/update/client/:clientId', authenticateUser, async (req, res) => {
  //TODO
})

module.exports = router;
