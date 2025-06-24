const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { getAllUsersController, getAllDoctorsController, updateDoctorStatusController } = require('../controllers/adminController')

// router object
const router = express.Router()

// Get All Users - Admin only
router.post('/getAllUsers', authMiddleware, getAllUsersController);

// Get All Doctors - Admin only
router.post('/getAllDoctors', authMiddleware, getAllDoctorsController);

// Update doctor status
router.post('/update-doctor-status', authMiddleware, updateDoctorStatusController);


module.exports = router