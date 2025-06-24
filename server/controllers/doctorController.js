const doctorModel = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel');

// get all information doctor
const getDoctorInfoByUserIdController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.userId });
        if (!doctor) {
            return res.status(404).send({
                success: false,
                message: 'Doctor not found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Doctor data fetched successfully',
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in fetching doctor info',
            error,
        });
    }
};

// update doctor profile
const updateDoctorProfileController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate(
            { userId: req.userId },
            {
                ...req.body,
                timings: req.body.timings, // [start, end]
            },
            { new: true }
        );

        res.status(200).send({
            success: true,
            message: 'Doctor profile updated successfully',
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in updating doctor profile',
            error,
        });
    }
};

// Get all approved doctors
const getApprovedDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ status: 'approved' });
        res.status(200).send({
            success: true,
            message: 'Approved Doctors Fetched Successfully',
            data: doctors,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error While Fetching Doctors',
            error,
        });
    }
};

// get doctor by id
const getDoctorInfoByIdController = async (req, res) => {
    try {
        const doctor = await doctorModel.findById(req.body.doctorId);
        if (!doctor) return res.status(404).send({ success: false, message: 'Not found' });
        res.status(200).send({ success: true, data: doctor });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error', err });
    }
};

// get appointments from users
const getDoctorAppointmentsController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.user.id });
        if (!doctor) {
            return res.status(404).send({ success: false, message: 'Doctor not found' });
        }

        const appointments = await appointmentModel.find({ doctorId: doctor._id }).populate('userId', 'name email');
        res.status(200).send({
            success: true,
            message: 'Appointments fetched successfully',
            data: appointments,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error fetching doctor appointments',
            error,
        });
    }
};


module.exports = { getDoctorInfoByUserIdController, updateDoctorProfileController, getApprovedDoctorsController, getDoctorInfoByIdController, getDoctorAppointmentsController };
