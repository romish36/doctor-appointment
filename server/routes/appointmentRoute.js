const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { bookAppointmentController, getDoctorAppointmentsController, updateAppointmentStatusController, getUserAppointmentsController } = require('../controllers/appointmentController');

const router = express.Router();

// POST book-appointment
router.post('/book-appointment', authMiddleware, bookAppointmentController);

// GET doctor appointments
router.get('/doctor-appointments', authMiddleware, getDoctorAppointmentsController);

// appointment approve or reject by doctor
router.post('/update-appointment-status', authMiddleware, updateAppointmentStatusController);

// see appointment booked by user
router.get('/user-appointments', authMiddleware, getUserAppointmentsController);

module.exports = router;