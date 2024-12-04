require('dotenv').config();
const express = require("express");
var cron = require('node-cron');
const moment = require('moment-timezone');
const  { sendin_in_out }  = require('./all_function/hcs_function');


const app = express();
app.use(express.json());

// console.log('DB Connection Config:', {
//     host: process.env.HOST,
//     user: process.env.USER_DATA,
//     database: process.env.DB,
//     password: process.env.PASSWORD_DB,
//     // port: process.env.PORT,
// });



const PORT = process.env.PORT || 5000;

const now = moment().tz('Asia/Manila');
const date = now.format('YYYY-MM-DD');
const time = now.format('HH:mm:ss');

app.get('/health', (req, res) => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // console.log(`Triggered at: ${now}`);
    // console.log(`Hours: ${hours}, Minutes: ${minutes}`);
    res.json({message: `Server is up and running`, server_date: now , server_hours: hours+":"+minutes});
});

// every Seconds = * * * * * *
// every Min =  * * * * *
// cron.schedule('* * * * * *', async () => {
//     try {
//         const data_val = await sendin_in_out(date);
//         // console.log(data_val)
//     } catch (error) {
//         console.log(error)
//     }
// });

// cron.schedule('* * * * * *', async () => {
//     try {
//         const now = new Date();
//         const hours = now.getHours();
//         const minutes = now.getMinutes();

//         console.log(`Triggered at: ${now}`);
//         console.log(`Hours: ${hours}, Minutes: ${minutes}`);
//         // console.log(data_val)
//     } catch (error) {
//         console.log(error)
//     }
// });


cron.schedule('0 7,22 * * *', async () => {
    try {
        const data_val = await sendin_in_out(date);

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        console.log(`date: ${date}`)
        // console.log(data_val)
    } catch (error) {
        console.log(error)
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} 🚀`);
});