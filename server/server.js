const express = require('express')
const app = express()

const dotenv = require('dotenv')
dotenv.config()

const cors = require('cors');
app.use(cors());

const dbConfig = require('./config/dbConfig')
app.use(express.json())

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`Server Started at port ${port}`)
})

const userRoute = require('./routes/userRoute')
app.use('/api/user', userRoute)

const adminRoute = require('./routes/adminRoute')
app.use('/api/admin', adminRoute)

const doctorRoute = require('./routes/doctorRoute');
app.use('/api/doctor', doctorRoute);

const appointmentRoute = require('./routes/appointmentRoute');
app.use('/api/appointment', appointmentRoute);

