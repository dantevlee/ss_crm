require("dotenv").config();
const express = require("express");
const router = express.Router();
const { dbPromise } = require("../resources/config");
const { authenticateUser } = require("../middleware/authenticateUser");

router.post('/lead/create-appointment', authenticateUser, async(req, res) => {
    const db = await dbPromise;

    try {
      const leadId = req.query.leadId  
      const {
        startTime,
        endTime,
        appointmentStartDate,
        appointmentEndDate,
        title,
        notes,
      } = req.body;

      if (!title) {
        return res
          .status(400)
          .json({
            message:
              "Please add event title.",
          });
      }
   
      if (!appointmentStartDate) {
        return res
          .status(400)
          .json({
            message:
              "Please add start date.",
          });
      }

      if (!appointmentEndDate) {
        return res
          .status(400)
          .json({
            message:
              "Please add end date.",
          });
        }
  
      if (startTime) {
        if (!endTime) {
            return res.status(400).json({ message: "Error: Please enter a time period." });
          }
      }
   
        const appointment = await db.query(
          'INSERT into "Lead_Appointments"("start_time, "endTime", "appointment_start_date", "appointment_end_date" "title", "notes", "lead_Id") VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING*',
          [
            startTime,
            endTime,
            appointmentStartDate,
            appointmentEndDate,
            title,
            notes,
            leadId
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
    const leadId = req.query.leadId  
    const appointmentId = req.params.appointmentId;

    const {
      startTime,
      endTime,
      appointmentStartDate,
      appointmentEndDate,
      title,
      notes, 
    } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({
          message:
            "Please add event title.",
        });
    }
 
    if (!appointmentStartDate) {
      return res
        .status(400)
        .json({
          message:
            "Please add start date.",
        });
    }

    if (!appointmentEndDate) {
      return res
        .status(400)
        .json({
          message:
            "Please add end date.",
        });
      }
  
      if (startTime) {
        if (!endTime) {
            return res.status(400).json({ message: "Error: Please enter a time period." });
          }
      }
   
        const appointment = await db.query(
          'UPDATE "Lead_Appointments" SET "start_time" = $1, "endTime" = $2, "appointment_start_date" = $3, "appointment_end_date" = $4 "notes" = $5, "title" = $6 WHERE id = $7 AND lead_Id = $8 RETURNING*',
          [
            startTime,
            endTime,
            appointmentStartDate,
            appointmentEndDate,
            title,
            notes,
            appointmentId,
            leadId
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
      await db.query(`DELETE FROM "Lead_Appointments" WHERE "id" = $1`, [appointmentId]);
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

  router.get(`/lead/appointments`, authenticateUser, async(req, res) => {
    const db = await dbPromise;

    try {
      const userId = req.id      
      const leadAppointments = await db.query(`SELECT "start_time", "endTime", "appointment_start_date", "appointment_end_date", "title", "notes" FROM "Lead_Appointments" la join "Leads" l on la.lead_id = l.id WHERE l.user_id = $1`, [userId])  
      return res.json(leadAppointments)
    } catch(error){
        console.error(error)
        return res.status(500).json({messsage: "Internal Server Error. Unable To Retrieve Lead Appointments."})
    }
  })
  

module.exports = router;