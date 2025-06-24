const bcrypt = require('bcryptjs')
const userModel = require('../models/userModel')
const doctorModel = require('../models/doctorModel');
const JWT = require('jsonwebtoken')

// registration
const registerController = async (req, res) => {
    try {
        const exisitingUser = await userModel.findOne({ email: req.body.email })
        if (exisitingUser) {
            return res.status(200).send({ message: 'User Already Registered', success: false })
        }
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        req.body.password = hashedPassword
        const newUser = new userModel(req.body)
        await newUser.save()
        res.status(201).send({ message: 'Register successfully', success: true })
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: `Register Controller ${error.message}` })
    }
}

// login callback
const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(200).send({ message: 'user not found', success: false })
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res.status(200).send({ message: 'Invalid Email or Password', success: false })
        }
        const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        // Prepare response
        let userData = user.toObject();

        // If doctor, fetch doctor info
        if (user.isDoctor) {
            const doctor = await doctorModel.findOne({ userId: user._id });
            userData.doctorInfo = doctor;
        }
        res.status(201).send({
            message: 'Login Successfull',
            success: true,
            token,
            user: userData, // ✅ Send complete user data with doctorInfo if applicable
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: `Error in login CTRL ${error.message}` })
    }
}

// authentication
const authController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.userId })
        user.password = undefined; // hide password
        if (!user) {
            return res.status(200).send({ message: 'User not found', success: false })
        } else {
            res.status(201).send({ success: true, data: user })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Auth Error', success: false, error })
    }
}

// for notification count
const getUserInfoById = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.userId });
        user.password = undefined;
        res.status(200).send({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).send({
            message: 'Error fetching user info',
            success: false,
            error,
        });
    }
};

// apply as doctor
const applyDoctorController = async (req, res) => {
    try {
        const newDoctor = new doctorModel({ ...req.body, userId: req.userId, status: 'pending' });
        await newDoctor.save();

        // find admin to send notification
        const adminUser = await userModel.findOne({ isAdmin: true });

        const unseenNotifications = adminUser.unseenNotifications || [];
        unseenNotifications.push({
            type: 'new-doctor-request',
            message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
                onClickPath: '/admin/doctors'
            }
        });

        await userModel.findByIdAndUpdate(adminUser._id, {
            unseenNotifications,
        });

        res.status(200).send({
            success: true,
            message: 'Doctor application applied successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while applying for doctor',
        });
    }
};

// Move all unseen notifications to seen
const markAllAsReadController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.userId });
        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }

        const seenNotifications = [...user.seenNotifications, ...user.unseenNotifications];
        user.unseenNotifications = [];
        user.seenNotifications = seenNotifications;

        await user.save();

        res.status(200).send({
            success: true,
            message: "Marked all as read",
            data: user,
        });
    } catch (error) {
        console.error("Error in markAllAsReadController:", error);
        res.status(500).send({
            success: false,
            message: "Error in marking all notifications as read",
            error: error.message,
        });
    }
};

// Delete all seen notifications
const deleteAllSeenNotificationsController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.userId });
        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }

        user.seenNotifications = [];
        await user.save();

        res.status(200).send({
            success: true,
            message: 'All seen notifications deleted',
            data: user,
        });
    } catch (error) {
        console.log("Delete Seen Notifications Error:", error);
        res.status(500).send({
            success: false,
            message: 'Error deleting seen notifications',
            error: error.message,
        });
    }
};

module.exports = { loginController, registerController, authController, getUserInfoById, applyDoctorController, markAllAsReadController, deleteAllSeenNotificationsController }