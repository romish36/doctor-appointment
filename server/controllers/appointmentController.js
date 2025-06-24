const appointmentModel = require('../models/appointmentModel');
const doctorModel = require('../models/doctorModel');
const userModel = require('../models/userModel');
const moment = require('moment');

// book appointment by user
const bookAppointmentController = async (req, res) => {
    try {
        const { doctorId, date, time } = req.body;
        const userId = req.user.id;

        const appointmentDate = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
        const appointmentTime = moment(time, 'HH:mm');

        // Check for existing appointments in the 30-minute window
        const allAppointments = await appointmentModel.find({
            doctorId,
            date: appointmentDate,
        });

        const isSlotTaken = allAppointments.some((appt) => {
            const apptTime = moment(appt.time, 'HH:mm');
            return (
                Math.abs(appointmentTime.diff(apptTime, 'minutes')) < 30
            );
        });

        if (isSlotTaken) {
            return res.status(400).send({
                success: false,
                message: 'This slot is already booked. Please select another time.',
            });
        }

        const newAppointment = new appointmentModel({
            doctorId,
            userId,
            date: appointmentDate,
            time: appointmentTime.format('HH:mm'),
            status: 'pending',
        });

        await newAppointment.save();

        res.status(200).send({
            success: true,
            message: 'Appointment booked successfully!',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Booking failed. Please try again.',
        });
    }
};

// get appointments for doctor
const getDoctorAppointmentsController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.user.id });
        if (!doctor) {
            return res.status(404).send({
                success: false,
                message: 'Doctor profile not found',
            });
        }

        const appointments = await appointmentModel
            .find({ doctorId: doctor._id })
            .populate('userId', 'name email');

        res.status(200).send({
            success: true,
            message: 'Appointments fetched successfully',
            data: appointments,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Failed to fetch appointments',
        });
    }
};

// appointment approve or reject
const updateAppointmentStatusController = async (req, res) => {
    try {
        const { appointmentId, status } = req.body;

        const appointment = await appointmentModel
            .findByIdAndUpdate(
                appointmentId,
                { status },
                { new: true }
            )
            .populate('userId', 'name email unseenNotifications'); // only fetch required fields

        if (!appointment || !appointment.userId) {
            return res.status(404).send({
                success: false,
                message: 'Appointment or user not found',
            });
        }

        // ✅ Push notification
        const notification = {
            type: 'status-update',
            message: `Your appointment on ${appointment.date} at ${appointment.time} has been ${status}.`,
            onClickPath: '/user/appointments',
        };

        const user = await userModel.findById(appointment.userId._id);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found for notification',
            });
        }

        user.unseenNotifications.push(notification);
        await user.save();

        res.status(200).send({
            success: true,
            message: `Appointment ${status} successfully`,
            data: appointment,
        });
    } catch (error) {
        console.error('Status update error:', error);
        res.status(500).send({
            success: false,
            message: 'Error updating appointment status',
            error: error.message,
        });
    }
};

// see appointment booked by user
const getUserAppointmentsController = async (req, res) => {
    try {
        const appointments = await appointmentModel
            .find({ userId: req.user.id })
            .populate('doctorId', 'firstName lastName specialization');

        res.status(200).send({
            success: true,
            message: 'User appointments fetched successfully',
            data: appointments,
        });
    } catch (error) {
        console.error('User Appointments Fetch Error:', error);
        res.status(500).send({
            success: false,
            message: 'Failed to fetch appointments',
            error,
        });
    }
};

module.exports = { bookAppointmentController, getDoctorAppointmentsController, updateAppointmentStatusController, getUserAppointmentsController };