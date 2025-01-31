require('dotenv').config();
const express = require("express");
const cors = require('cors');
var cron = require('node-cron');
const moment = require('moment-timezone');
const  { sendin_in_out, sending_ALL, retry_send }  = require('./all_function/hcs_function');
const { email_sending, get_HtmlData } = require('./all_function/email_notif');
const { exec } = require('child_process');
const os = require('os');
const { getMAC, isMAC } = require('getmac')
const mysql = require('mysql2/promise');

const app = express();
app.use(cors()); // Allow all origins
app.use(cors({
    origin: 'https://bms.jakagroup.com',
    methods: ['GET', 'POST'],
    // allowedHeaders: ['Content-Type', 'Authorization']
  }));


app.use(express.json());


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
// cron.schedule('0 * * * *', async () => {
//     try {
        
//         // console.log(data_val)

//         const now = new Date();
//         const hours = now.getHours();
//         const minutes = now.getMinutes();
//         console.log(`Triggered at: ${now}`);
//         const data_val = await sendin_in_out(date);
//         // console.log(`Hours: ${hours}, Minutes: ${minutes}`);

        
//     } catch (error1) {
//         exec('pm2 restart 8', (error, stdout, stderr) => {
//             if (error) {
//               console.error(`Error: ${error.message}`);
//               return;
//             }
//             if (stderr) {
//               console.error(`Stderr: ${stderr}`);
//               return;
//             }
//             console.log(`Stdout: ${stdout}`);
//           });
//         console.log(error1)

//         const now = new Date();
//         let  hours = now.getHours();
//         const minutes = now.getMinutes();
//         const seconds = now.getSeconds();
//         const ampm = hours >= 12 ? 'PM' : 'AM';
//         hours = hours % 12;
//         hours = hours || 12; // Replace 0 with 12
//         const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;

//     const result = await email_sending('christian.villamer@iteklabs.tech;cvillamer13@gmail.com', "Encounter problem! \n " + error1, `Problem ${date} - ${formattedTime}`);
//     }
        
// });

// cron.schedule('*/10 * * * * *', async () => {
//     try {
        
//         // console.log(data_val)

//         const now = new Date();
//         const hours = now.getHours();
//         const minutes = now.getMinutes();
//         console.log(`Triggered at: ${now}`);
//         const data_val = await sending_ALL();
//         // console.log(`Hours: ${hours}, Minutes: ${minutes}`);

        
//     } catch (error1) {
//         exec('pm2 restart 8', (error, stdout, stderr) => {
//             if (error) {
//               console.error(`Error: ${error.message}`);
//               return;
//             }
//             if (stderr) {
//               console.error(`Stderr: ${stderr}`);
//               return;
//             }
//             console.log(`Stdout: ${stdout}`);
//           });
//         console.log(error1)

//         const now = new Date();
//         let  hours = now.getHours();
//         const minutes = now.getMinutes();
//         const seconds = now.getSeconds();
//         const ampm = hours >= 12 ? 'PM' : 'AM';
//         hours = hours % 12;
//         hours = hours || 12; // Replace 0 with 12
//         const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;

//     const result = await email_sending('christian.villamer@iteklabs.tech;cvillamer13@gmail.com', "Encounter problem! \n " + error1, `Problem ${date} - ${formattedTime}`);
//     }
        
// });



// schedule report for 5am   11pm
// cron.schedule('0 5,12,17,23 * * *', async () => {
//     try {

//         const now = new Date();
//         let  hours = now.getHours();
//         const minutes = now.getMinutes();
//         const seconds = now.getSeconds();
//         const ampm = hours >= 12 ? 'PM' : 'AM';
//         hours = hours % 12;
//         hours = hours || 12; // Replace 0 with 12
//         const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
//         let dataTable = '';
//         dataTable += '<table border="1">'
//             dataTable += '<thead>'
//                 dataTable += '<tr>'
//                     dataTable += '<th>ID</th>'
//                     dataTable += '<th>Name</th>'
//                     dataTable += '<th>PIN</th>'
//                     dataTable += '<th>Date IN</th>'
//                     dataTable += '<th>IN</th>'
//                     dataTable += '<th>Date OUT</th>'
//                     dataTable += '<th>OUT</th>'
//                     dataTable += '<th>Status HCS (IN)</th>'
//                     dataTable += '<th>Status HCS (OUT)</th>'
//                     dataTable += '<th>Remarks</th>'
//                 dataTable += '</tr>'
//             dataTable += '</thead>'
//             dataTable += '<tbody>'
//             //function here
//             const HTML = await get_HtmlData(date);
//             let tbodyHTML = '';
//             for (let index = 0; index <= HTML.length-1; index++) {
//                 const element = HTML[index];
//                 let in_mean = "No Puush"
//                 if(element.isSentToHCS_in){
//                     in_mean = "Push"
//                 }
//                 let out_mean = "No Puush"
//                 if(element.isSentToHCS_out){
//                     out_mean = "Push"
//                 }
        
//                 tbodyHTML += '<tr>'
//                 tbodyHTML += '<td>'+element.A_id+'</td>'
//                 tbodyHTML += '<td>'+element.U_Name+'</td>'
//                 tbodyHTML += '<td>'+element.U_PIN+'</td>'
//                 tbodyHTML += '<td>'+element.date_in+'</td>'
//                 tbodyHTML += '<td>'+element.time_in+'</td>'
//                 tbodyHTML += '<td>'+element.date_out+'</td>'
//                 tbodyHTML += '<td>'+element.out_time+'</td>'
//                 tbodyHTML += '<td><b>'+in_mean+'</b></td>'
//                 tbodyHTML += '<td><b>'+out_mean+'</b></td>'
//                 tbodyHTML += '<td></td>'
//                 tbodyHTML += '</tr>'
                
//             }
//             dataTable += tbodyHTML
//             dataTable += '</tbody>'
//         dataTable += '</table>'
//         const result = await email_sending('christian.villamer@iteklabs.tech', dataTable, `Cronjob ${date} - ${formattedTime}`);
//         console.log(`Cronjob ${date} - ${formattedTime}`)
//         // console.log(dataTable)
//         // console.log(`date: ${date} -  ${formattedTime}`)
//         // console.log(data_val)
//     } catch (error) {
//         console.log(error)
//     }
// });



// cron.schedule('*/5 * * * * *', async () => {
//     try {
        
//         var data = await retry_send();
//         console.log(date, data[0])
//     } catch (error) {
        
//     }
// })


async function connectToDatabase_beat() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.HOST,
            user: process.env.user_beat,
            password: process.env.password_beat,
            database: process.env.db_beat,
            // port: 5013,
        });
        // console.log('Connected to MySQL!');
        return connection;
    } catch (err) {
        console.error('Failed to connect to MySQL:', err.message);
        throw err;
    }
}

async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER_DATA,
            password: process.env.PASSWORD_DB,
            database: process.env.DB,
            // port: 5013,
        });
        // console.log('Connected to MySQL!');
        return connection;
    } catch (err) {
        console.error('Failed to connect to MySQL:', err.message);
        throw err;
    }
}


app.post('/checking_health', (req, res) => {
    console.log(req.body)
    res.json(req.body);
});

// cron.schedule('*/10 * * * * *', async () => {
//     try {
//         const now = moment().tz('Asia/Manila');
//         const date = now.format('YYYY-MM-DD');
//         const time = now.format('HH:mm:ss');

//         const connection = await connectToDatabase(); 
//         const [rows] = await connection.query( `SELECT * FROM areas WHERE mac_address IS NOT NULL`, []);

//         for (let index = 0; index <= rows.length-1; index++) {
//             const element = rows[index];
//             const connection_bet = await connectToDatabase_beat(); 
//             const [rows_beat] = await connection_bet.query( `SELECT * FROM heart_beat WHERE mac_address = ? AND date = ? AND time = ?`, [element.mac_address, date, time]);
//             console.log(rows_beat)
            
//         }

        
//         await connection.end(); 

        
//     } catch (error1) {
//         console.log(error1)
//     }
        
// });

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} 🚀`);
});