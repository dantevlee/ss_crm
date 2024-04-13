require("dotenv").config();
const express = require("express");
const router = express.Router();
const dbPromise = require("../resources/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register/user", async (req, res) => {
  const db = await dbPromise;
  try {
    const { firstName, lastName, userName, password } = req.body;
    const userExists = await db.query(
      `SELECT * FROM "Users" WHERE "Users"."userName" = $1`,
      [userName]
    );

    if (userExists.length > 0) {
      return res
        .status(409)
        .json({ error: `A user with username: ${userName} already exists` });
    } else {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const registeredUser = await db.query(
        `INSERT INTO "Users"("firstName", "lastName", "userName", "password") VALUES($1, $2, $3, $4) RETURNING *`,
        [firstName, lastName, userName, hashedPassword]
      );
      return res.json({ registeredUser });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const db = await dbPromise;
  const { email } = req.body;
  try {
    const user = await db.query(
      `SELECT * FROM "Users" WHERE "Users"."userName" = $1`,
      [email]
    );
    console.log(user);
    if (user.length === 0) {
      return res.status(401).json({
        status: "failed",
        userData: [],
        message: "This user does not exit. Please create an account.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      `${req.body.password}`,
      user[0].password
    );

    if (!isPasswordValid)
      return res.status(401).json({
        status: "failed",
        userData: [],
        message:
          "Invalid email or password. Please try again with the correct credentials.",
      });

    const loggedInUserPayload = {
      id: user[0].id,
    };

    const token = jwt.sign(
      loggedInUserPayload,
      process.env.SECRET_ACCESS_TOKEN
    );
    res.cookie("SessionID", token);
    return res.status(200).json({
      status: "success",
      username: user[0].userName,
      message: "Login Successful!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const authHeader = req.headers["cookie"];

    if (!authHeader) return res.sendStatus(401);

    res.setHeader("Clear-Site-Data", '"cookies"');
    res.clearCookie("SessionID");
    return res.status(200).json({ message: "You are logged out!" });
  } catch (error) {
    return res.status(500).json({
      status: "Internal Server Error",
      message:
        "An error occurred while attempting to logout. Please try again later.",
    });
  }
});

router.post('/password-reset', async(req, res) => {
  //TODO
})

module.exports = router;
