require('dotenv').config();
const express = require("express");
var cron = require('node-cron');
const moment = require('moment-timezone');
const  { sendin_in_out }  = require('./all_function/hcs_function');


const app = express();
app.use(express.json());




const PORT = process.env.PORT || 5000;

const now = moment().tz('Asia/Manila');
const date = now.format('YYYY-MM-DD');
const time = now.format('HH:mm:ss');

app.get('/health', (req, res) => {
    res.send(`Server is up and running date: ${date}`);
});

// every Seconds = * * * * * *
// every Min =  * * * * *
// cron.schedule('* * * * * *', async () => {
//     try {
//         const data_val = await sendin_in_out(date);
//         console.log(data_val)
//     } catch (error) {
//         console.log(error)
//     }
// });


cron.schedule('0 5,22 * * *', async () => {
    try {
        const data_val = await sendin_in_out(date);
        console.log(data_val)
    } catch (error) {
        console.log(error)
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} 🚀`);
});