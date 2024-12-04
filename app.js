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

function logMemoryUsage() {
    const memoryUsage = process.memoryUsage();

    console.log('Memory Usage:');
    console.log(`- RSS (Resident Set Size): ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- External: ${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Array Buffers: ${(memoryUsage.arrayBuffers / 1024 / 1024).toFixed(2)} MB`);
}
setInterval(() => {
    logMemoryUsage();
}, 5000)

if (global.gc) {
    global.gc();  // Forces a GC cycle
} else {
    global.gc();
    console.log('Garbage collection is not exposed');
}


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