const userModel = require('../models/userModel')
const doctorModel = require('../models/doctorModel');

// Get all users - Admin only
const getAllUsersController = async (req, res) => {
    try {
        // ✅ Exclude admin users
        const users = await userModel.find({ isAdmin: false });

        const doctors = await doctorModel.find({});

        // Build a Set of doctor userIds
        const doctorUserIds = new Set(doctors.map(doc => doc.userId.toString()));

        // Merge isDoctor dynamically based on doctorModel
        const updatedUsers = users.map(user => ({
            ...user._doc,
            isDoctor: doctorUserIds.has(user._id.toString()),
        }));

        res.status(200).json({ success: true, data: updatedUsers });
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        res.status(500).json({ success: false, message: "Error fetching users" });
    }
};

// Get All Doctors - Admin only
const getAllDoctorsController = async (req, res) => {
    try {
        const adminUser = await userModel.findById(req.userId);
        if (!adminUser || !adminUser.isAdmin) {
            return res.status(403).send({ success: false, message: "Access denied" });
        }

        const doctors = await doctorModel.find({});
        res.status(200).send({
            success: true,
            message: "Doctors fetched successfully",
            data: doctors,
        });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).send({
            success: false,
            message: "Error fetching doctors",
            error: error.message,
        });
    }
};

// Update Doctor Status: approve or reject
const updateDoctorStatusController = async (req, res) => {
    try {
        const { doctorId, status } = req.body;

        const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status }, { new: true });

        const user = await userModel.findById(doctor.userId);
        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }

        user.unseenNotifications.push({
            type: 'doctor-account-request-updated',
            message: `Your Doctor Account Request has been ${status}`,
            onClickPath: '/notification',
        });

        user.isDoctor = status === 'approved';
        await user.save();

        res.status(200).send({
            success: true,
            message: `Doctor status updated to ${status}`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in updating doctor status',
            error,
        });
    }
};



module.exports = { getAllUsersController, getAllDoctorsController, updateDoctorStatusController }