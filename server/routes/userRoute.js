const express = require('express')
const { loginController, registerController, authController, getUserInfoById, applyDoctorController, markAllAsReadController, deleteAllSeenNotificationsController } = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')

// router object
const router = express.Router()

// routes

// LOGIN || POST
router.post('/login', loginController)

// REGISTER || POST
router.post('/register', registerController)

// Auth || POST
router.post('/getUserData', authMiddleware, authController)

// POST route to get user info || for notification count
router.post('/get-user-info-by-id', authMiddleware, getUserInfoById);

// APPLY DOCTOR
router.post('/apply-doctor', authMiddleware, applyDoctorController);

// unseen notification sent in seen notification
router.post('/mark-all-notifications-as-read', authMiddleware, markAllAsReadController);

// delete seen notification
router.post('/delete-all-seen-notifications', authMiddleware, deleteAllSeenNotificationsController);

module.exports = router