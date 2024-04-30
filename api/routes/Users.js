require("dotenv").config();
const express = require("express");
const router = express.Router();
const { dbPromise, transporter } = require("../resources/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto')

router.post("/register/user", async (req, res) => {
  const db = await dbPromise;
  try {
    const { firstName, lastName, email, password, confirmPassword } =
      req.body;
    const userExists = await db.query(
      `SELECT * FROM "Users" WHERE "Users"."email" = $1`,
      [email]
    );

    if (userExists.length > 0) {
      return res
        .status(409)
        .json({ error: `A user with this email already exists.` });
    } else {
      const salt = await bcrypt.genSalt();
      if (password === confirmPassword) {
        try{
          const hashedPassword = await bcrypt.hash(password, salt);
          const confirmationToken = crypto.randomBytes(20).toString('hex');
          await db.query(
            `INSERT INTO "Users"("firstName", "lastName", "email", "password", "confirmation_token") VALUES($1, $2, $3, $4, $5) RETURNING *`,
            [firstName, lastName, email, hashedPassword, confirmationToken]
          );
          
          const confirmationUrl = `http://localhost:3000/api/confirm-email?token=${confirmationToken}`;
          const mailContent = {
            from: process.env.ADMIN_EMAIL,
            to: email,
            subject: `Confirm Your Account`,
            text:  `Welcome to our platform! Please confirm your email address by clicking the following link: 
           ${confirmationUrl}`,
          };

          transporter.sendMail(mailContent, (error) => {
            if (error) {
              console.error(error);
              return res
                .status(500)
                .json({ error: `Could not send confirmation email. Please try again later.` });
            } else {
              res.json({ message: `Confirmation email sent! Please check your email to activate your account.` });
            }
          });
        } catch (error) {
          console.error("An error occurred with creating your account.", error)
        }
      } else {
        return res.status(400).json({
          message:
            "Passwords don't match. Please try another password.",
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/confirm-email", async (req, res) => {
  const { token } = req.query;
  const db = await dbPromise;
  try {
    const user = await db.query(
      `SELECT * FROM "Users" WHERE "confirmation_token" = $1`,
      [token]
    );

    if (user.length === 0) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid confirmation token.",
      });
    }

    await db.query(
      `UPDATE "Users" SET "confirmed_user" = $1 WHERE "confirmation_token" = $2`,
      ['Y', token]
    );
    const loginUrl = `http://localhost:5173/`
    return res.send(`Email confirmed! Log into your account by clicking <a href="${loginUrl}">Here</a>!`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Could not confirm email. Please try again later." });
  }
});


router.post("/login", async (req, res) => {
  const db = await dbPromise;
  const { email } = req.body;
  try {
    const user = await db.query(
      `SELECT * FROM "Users" WHERE "Users"."email" = $1`,
      [email]
    );
    if (user.length === 0) {
      return res.status(401).json({
        status: "failed",
        userData: [],
        message: "This user does not exist. Please create an account.",
      });
    }

    if (user[0].confirmed_user !== 'Y') {
      return res.status(401).json({
        status: "failed",
        userData: [],
        message: "Please confirm your email to log in.",
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
          "Invalid email or password. Please try again.",
      });

    const loggedInUserPayload = {
      id: user[0].id,
      email: user[0].email
    };

    const token = jwt.sign(
      loggedInUserPayload,
      process.env.SECRET_ACCESS_TOKEN
    );
    res.cookie("SessionID", token);
    return res.status(200).json({
      status: "success",
      id: user[0].id,
      email: user[0].email,
      message: "Login Successful!",
      token: token
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

router.post("/reset/request", async (req, res) => {
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
        error: `That e-mail does not exist in our records.`,
      });
    }

    const resetToken = jwt.sign({ email }, process.env.SECRET_ACCESS_TOKEN, {
      expiresIn: "1h",
    });

    await db.query(
      `INSERT INTO "Reset_Tokens"("email", "token") VALUES($1, $2)`,
      [email, resetToken]
    );

    const resetUrl = `http://localhost:5173/change-password?token=${resetToken}`;

    const mailContent = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: `CRM Password Reset`,
      text: `You recently requested a password reset. Click on the following link to reset your password: ${resetUrl}`,
    };

    transporter.sendMail(mailContent, (error) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ error: `Could not send mail due to internal server error.` });
      } else {
        res.json({ message: `Check your email to reset your password!` });
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
  const { newPassword, confirmPassword } = req.body;
  const { token } = req.query;
  const db = await dbPromise;

  try {

    const findEmail = await db.query(`SELECT email from "Reset_Tokens" WHERE "token" = $1`, [token])
   
    if (findEmail.length === 0) {
      return res.status(401).json({
        status: "failed",
        message: `Could not locate a valid token in our records. Please request a new one.`,
      });
    }

    const email = findEmail[0].email

    const validToken = await db.query(
      `SELECT * FROM "Reset_Tokens" WHERE "email" = $1 AND "token" = $2`,
      [email, token]
    );

    if (validToken.length === 0) {
      return res.status(401).json({
        message: "Could not locate password reset request. Please request a new one.",
      });
    }

    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, async (err) => {
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
