require("dotenv").config();
const express = require("express");
const router = express.Router();
const { dbPromise } = require("../resources/config");
const { authenticateUser } = require("../middleware/authenticateUser");

router.post('/create-appointment', authenticateUser, async(req, res) => {
    try{

    } catch(error){
      
    }
})

module.exports = router;