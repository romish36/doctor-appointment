const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getDoctorInfoByUserIdController, updateDoctorProfileController, getApprovedDoctorsController, getDoctorInfoByIdController, getDoctorAppointmentsController } = require('../controllers/doctorController');

const router = express.Router();

// GET doctor profile by user ID
router.post('/get-doctor-info-by-user-id', authMiddleware, getDoctorInfoByUserIdController);

// UPDATE doctor profile
router.post('/update-doctor-profile', authMiddleware, updateDoctorProfileController);

// Route to get all approved doctors
router.get('/get-all-approved-doctors', authMiddleware, getApprovedDoctorsController);

// get doctor by id
router.post('/getDoctorInfoById', authMiddleware, getDoctorInfoByIdController);

// get appointment from users
router.get('/appointments', authMiddleware, getDoctorAppointmentsController);

module.exports = router;
