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
const axios = require('axios');
const ejs = require('ejs');
const path = require("path");
const bodyParser = require('body-parser');
const flash = require('connect-flash');
var session = require('express-session');
const cookieParser = require('cookie-parser');



const app = express();
app.use(cors()); // Allow all origins
// app.use(cors({
//     origin: 'https://bms.jakagroup.com',
//     methods: ['GET', 'POST'],
//     // allowedHeaders: ['Content-Type', 'Authorization']
//   }));


  
app.use(session({
    secret: 'this is my secretkey',
    resave: false,
    cookie: { maxAge: 1000 * 60 },
    saveUninitialized: true,
    // store: store,
  }));

app.use(flash());

app.use(express.json());
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "view"));
app.use(express.static(path.join(__dirname, "public")));

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
async function getLocation(mac_address){
    try {
        const connection = await connectToDatabase(); 
        const [rows] = await connection.query( `SELECT * FROM areas WHERE mac_address = ?`, [mac_address]);
        await connection.end();
        return rows;
    } catch (error) {
        
    }
}
const heartbeats = new Map();
app.post('/heartbeat', async (req, res) => {
    const { pc_id, token, mac_address } = req.body;
    const loc_data = await getLocation(mac_address)
    let name ;
    if(loc_data[0] == undefined){
        name = "NO LOCATION"
    }else{
        name = loc_data[0].name
    }
    
    console.log(name)
    heartbeats.set(pc_id, { timestamp: Date.now(), mac_address, name });
    // console.log(req.body)
    res.send('Heartbeat received');
  });
  app.get('/status_pc', (req, res) => {
    const status = {};
    const now = Date.now();
    const OFFLINE_THRESHOLD = 30 * 1000;
  
    heartbeats.forEach( (timestamp, pcId) => {
        // const loc_data = await getLocation(timestamp.mac_address)
        // console.log(loc_data[0])
    status[pcId] = {
        status: (now - timestamp.timestamp) < OFFLINE_THRESHOLD ? 'online' : 'offline',
        mac_address: timestamp.mac_address,
        location_data: timestamp.name
      };
    //   console.log(timestamp.timestamp)
    //   status[pcId] = timestamp.mac_address;
    });
  
    res.json(status);
  });


    async function sendoutside(data, stat){
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://hrms.iteklabs.tech/api/inout',
            headers: { 
                'Content-Type': 'application/json'
            },
            data : data,
            timeout:30000
        };

        const response = await axios.request(config);
        const data_response = response.data;

        

        try {
            var fingerprintd= data_response.message.finger_print_id;
            var date_time= data_response.message.in_out_time;
            var type_return = data_response.message.type;
            var bms_id = data_response.message.bms_id;
            const connection = await connectToDatabase();
            console.log(stat, data_response.status, rows[0])
            if (data_response.status === 200) {
                const [rows] = await connection.query( `SELECT * FROM users WHERE pin = ?`, [fingerprintd]);

                const formattedDate = moment
                .tz(`${date_time}`, "Asia/Manila")
                .format("YYYY-MM-DD");

                var user_id = rows[0].id;
                console.log(bms_id)
                if (type_return === "I") {
                    updateQuery = `UPDATE attendances SET isSentToHCS_in = true WHERE worker_id = ? AND date = ? AND id = ?`;
                } else if (type_return === "O") {
                    updateQuery = `UPDATE attendances SET isSentToHCS_out = true WHERE worker_id = ? AND date_out = ? AND id = ?`;
                }

                if (updateQuery) {
                    await connection.query(updateQuery, [user_id, formattedDate, bms_id]);
                }

                await connection.end();
            } else {
                // console.log("Failed to send data:", data_response.message);
                await connection.end();
            }
            


            
        } catch (error) {
            if (error.response?.status === 429) {
                const retryAfter = error.response.headers["retry-after"] || 1;
                console.log(`Rate limit reached. Retrying after ${retryAfter} seconds...`);
                await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
                return sendoutside(data); // Retry after waiting
            }
    
        }
    }

cron.schedule('0,30 * * * *', async () => {
    try {
        const now = moment().tz('Asia/Manila');
        const date = now.format('YYYY-MM-DD');
        const time = now.format('HH:mm:ss');
        const connection = await connectToDatabase(); 
        console.log(time)
        // bms_id
        const [rows] = await connection.query( `SELECT attendances.date AS date, attendances.in_time AS in_time, users.pin AS pin, attendances.id AS bms_id FROM attendances LEFT JOIN users ON users.id = attendances.worker_id WHERE date = ? AND isSentToHCS_in = false `, [date]);

        for (const row of rows) {
            const formattedDate = moment
                .tz(`${moment(row.date).format("YYYY-MM-DD")} ${row.in_time}`, "Asia/Manila")
                .format("YYYY-MM-DD HH:mm:ss");

            const data_in = {
                PIN: row.pin,
                date_time: formattedDate,
                type: "I",
                bms_id: row.bms_id
            };
            console.log(data_in)
            await sendoutside(data_in, "G");
        }
         // Fetch OUT records
         const [rows_out] = await connection.query(
            `SELECT attendances.date_out AS date_out, attendances.out_time AS out_time, users.pin AS pin, attendances.id AS bms_id FROM attendances 
             LEFT JOIN users ON users.id = attendances.worker_id 
             WHERE date_out = ? AND isSentToHCS_out = false`, 
            [date]
        );
        
        for (const row of rows_out) {
            const formattedDate = moment
                .tz(`${moment(row.date_out).format("YYYY-MM-DD")} ${row.out_time}`, "Asia/Manila")
                .format("YYYY-MM-DD HH:mm:ss");

            const data_out = {
                PIN: row.pin,
                date_time: formattedDate,
                type: "O",
                bms_id: row.bms_id
            };
            console.log(data_out)
            await sendoutside(data_out, "G");
        }
        await connection.end();
        // console.log(date)
    } catch (error) {
        console.log(error.response?.config.data)
        if (error.response?.status === 429) {
            const retryAfter = error.response.headers["retry-after"] || 1;
            console.log(`Rate limit reached. Retrying after ${retryAfter} seconds...`);
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
            await sendoutside(error.response?.config.data, "R"); // Retry after waiting
        }
    }
        
});
const login_router = require("./routes/login");
app.use("/", login_router);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} 🚀`);
});