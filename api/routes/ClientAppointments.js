require("dotenv").config();
const express = require("express");
const router = express.Router();
const { dbPromise } = require("../resources/config");
const { authenticateUser } = require("../middleware/authenticateUser");
const { default: cli } = require("@angular/cli");

router.post('/client/create-appointment', authenticateUser, async(req, res) => {
    const db = await dbPromise;

    try {
      const {
        startTime,
        endTime,
        appointmentDate,
        notes,
        clientId
      } = req.body;
   
      if (!appointmentDate) {
        return res
          .status(400)
          .json({
            message:
              "Please add date.",
          });
      }
  
      if (startTime) {
        if (!endTime) {
            return res.status(400).json({ message: "Error: Please enter a time period." });
          }
      }
   
        const appointment = await db.query(
          'INSERT into "Client_Appointments"("start_time, "endTime", "appointment_date", "notes", "client_id") VALUES($1, $2, $3, $4, $5) RETURNING*',
          [
            startTime,
            endTime,
            appointmentDate,
            notes,
            clientId
          ]
        );
  
        return res.json(appointment[0]);
      } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal Servor Error. Unable to create schedule entry.",
      });
    }
})

router.put('/update/appointments/:appointmentId', authenticateUser, async(req, res) => {
    const db = await dbPromise;

    try {
    const appointmentId = req.params.appointmentId;
      const {
        startTime,
        endTime,
        appointmentDate,
        notes, 
        clientId
      } = req.body;
   
      if (!appointmentDate) {
        return res
          .status(400)
          .json({
            message:
              "Please add date.",
          });
      }
  
      if (startTime) {
        if (!endTime) {
            return res.status(400).json({ message: "Error: Please enter a time period." });
          }
      }
   
        const appointment = await db.query(
          'UPDATE "Client_Appointments" SET "start_time" = $1, "endTime" = $2, "appointment_date" = $3, "notes" = $4 WHERE id = $5 AND client_id = $6 RETURNING*',
          [
            startTime,
            endTime,
            appointmentDate,
            notes,
            appointmentId,
            clientId
          ]
        );
  
        return res.json(appointment[0]);
      } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal Servor Error. Unable to create schedule entry.",
      });
    }
})

router.delete(`/delete/appointments/:appointmentId`, authenticateUser, async (req, res) => {
    const db = await dbPromise;
  
    try {
      const appointmentId = req.params.appointmentId;
      if(!appointmentId){
        return res.status(404).json({message: "Unable to find task to be deleted."})
      }
      await db.query(`DELETE FROM "Client_Appointments" WHERE "id" = $1`, [appointmentId]);
      return res.json({ message: "Task Successfully Deleted." });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({
          message: "Internal Server Error. Unable To Delete Scheduled Task.",
        });
    }
  });

  router.get(`/client/appointments`, authenticateUser, async(req, res) => {
    const db = await dbPromise;

    try {
      const userId = req.id  
      const clientAppointments = await db.query(`SELECT ca."start_time", ca."endTime" ,ca."appointment_date", ca."notes", c."start_date", c."end_date" FROM "Client_Appointments" ca join "Clients" c on ca.client_id = c.id WHERE c.user_id = $1`, [userId])  
      return res.json(clientAppointments)
    } catch(error){
        console.error(error)
        return res.status(500).json({messsage: "Internal Server Error. Unable To Retrieve Client Appointments."})
    }
  })
  

module.exports = router;