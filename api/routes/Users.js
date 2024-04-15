require("dotenv").config();
const express = require("express");
const router = express.Router();
const { dbPromise, transporter } = require("../resources/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register/user", async (req, res) => {
  const db = await dbPromise;
  try {
    const { firstName, lastName, userName, email, password, confirmPassword } =
      req.body;
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
      if (password === confirmPassword) {
        try{
          const hashedPassword = await bcrypt.hash(password, salt);
          await db.query(
            `INSERT INTO "Users"("firstName", "lastName", "userName", "email", "password") VALUES($1, $2, $3, $4, $5) RETURNING *`,
            [firstName, lastName, userName, email, hashedPassword]
          );
          return res.json({ username: userName, email: email });
        } catch(error){
          console.error("An error occured with saving a new user.",error)
        }
     
      } else {
        return res.status(400).json({
          message:
            "Password don't match. Please retry with creating a password.",
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const db = await dbPromise;
  const { username } = req.body;
  try {
    const user = await db.query(
      `SELECT * FROM "Users" WHERE "Users"."userName" = $1`,
      [username]
    );
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

router.post("/password-reset/request", async (req, res) => {
  const { email } = req.body;
  const db = await dbPromise;
  try {
    const emailExists = await db.query(
      `SELECT * FROM "Users" WHERE "Users"."email" = $1`,
      [email]
    );

    if (emailExists.length === 0) {
      return res.status(401).json({
        status: "failed",
        message: `The email: ${email} does not exist in our records. Please try again later.`,
      });
    }

    const resetToken = jwt.sign({ email }, process.env.SECRET_ACCESS_TOKEN, {
      expiresIn: "1h",
    });

    await db.query(
      `INSERT INTO "Reset_Tokens"("email", "token") VALUES($1, $2)`,
      [email, resetToken]
    );

    const mailContent = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: `CRM Password Reset`,
      text: `You recently requested a password reset. Click this link and follow the prompts to continue.`,
    };

    transporter.sendMail(mailContent, (error) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ error: `Could not send mail due to internal server error.` });
      } else {
        res.json({ message: `Reset password email successfully sent!` });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message:
        "A systems error ocurred while attempting to send email to reset your password.",
    });
  }
});

router.post("/password/reset", async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;
  const { email } = req.query;
  const db = await dbPromise;

  try {
    const validToken = await db.query(
      `SELECT * FROM "Reset_Tokens" WHERE "email" = $1 AND "token" = $2`,
      [email, token]
    );

    if (validToken.length === 0) {
      return res.status(401).json({
        message: "Could not locate password reset request. Please request a new one.",
      });
    }

    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Invalid or expired reset token. Please request a new one.",
        });
      }

      try{
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);
  
        const currentPassword = await db.query(`SELECT "password" FROM "Users" WHERE "email" = $1`, [email]);
        const isSamePassword = await bcrypt.compare(newPassword, currentPassword[0].password);
  
        if (isSamePassword) {
          return res.status(400).json({ message: "New password cannot be the same as old password." });
        }
  
        if (newPassword === confirmPassword) {
          await db.query(`UPDATE "Users" SET "password" = $1 WHERE "email" = $2`, [hashedPassword, email]);
          await db.query(`DELETE FROM "Reset_Tokens" WHERE "email" = $1 AND "token" = $2`, [email, token]);
          return res.status(204).json({ message: "Password reset successful!" });
        } else {
          return res.status(400).json({ message: "Passwords must match. Please try again." });
        }

      } catch(error){
        console.error(`An error occurred with updating the new password for email: ${email}`,error)
      }
     
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not reset password. Please try again later." });
  }
});

module.exports = router;
