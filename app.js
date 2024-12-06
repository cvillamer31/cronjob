require('dotenv').config();
const express = require("express");
var cron = require('node-cron');
const moment = require('moment-timezone');
const  { sendin_in_out }  = require('./all_function/hcs_function');
const { email_sending, get_HtmlData } = require('./all_function/email_notif');


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
cron.schedule('*/5 * * * * *', async () => {
    try {
        
        // console.log(data_val)

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        console.log(`Triggered at: ${now}`);
        const data_val = await sendin_in_out(date);
        // console.log(`Hours: ${hours}, Minutes: ${minutes}`);
    } catch (error) {
        console.log(error)
    }
});

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

// schedule report for 5am   11pm
cron.schedule('0 5,12,17,23 * * *', async () => {
    try {

        const now = new Date();
        let  hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours || 12; // Replace 0 with 12
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
        let dataTable = '';
        dataTable += '<table border="1">'
            dataTable += '<thead>'
                dataTable += '<tr>'
                    dataTable += '<th>ID</th>'
                    dataTable += '<th>Name</th>'
                    dataTable += '<th>PIN</th>'
                    dataTable += '<th>Date IN</th>'
                    dataTable += '<th>IN</th>'
                    dataTable += '<th>Date OUT</th>'
                    dataTable += '<th>OUT</th>'
                    dataTable += '<th>Status HCS (IN)</th>'
                    dataTable += '<th>Status HCS (OUT)</th>'
                    dataTable += '<th>Remarks</th>'
                dataTable += '</tr>'
            dataTable += '</thead>'
            dataTable += '<tbody>'
            //function here
            const HTML = await get_HtmlData(date);
            let tbodyHTML = '';
            for (let index = 0; index <= HTML.length-1; index++) {
                const element = HTML[index];
                let in_mean = "No Puush"
                if(element.isSentToHCS_in){
                    in_mean = "Push"
                }
                let out_mean = "No Puush"
                if(element.isSentToHCS_out){
                    out_mean = "Push"
                }
        
                tbodyHTML += '<tr>'
                tbodyHTML += '<td>'+element.A_id+'</td>'
                tbodyHTML += '<td>'+element.U_Name+'</td>'
                tbodyHTML += '<td>'+element.U_PIN+'</td>'
                tbodyHTML += '<td>'+element.date_in+'</td>'
                tbodyHTML += '<td>'+element.time_in+'</td>'
                tbodyHTML += '<td>'+element.date_out+'</td>'
                tbodyHTML += '<td>'+element.out_time+'</td>'
                tbodyHTML += '<td><b>'+in_mean+'</b></td>'
                tbodyHTML += '<td><b>'+out_mean+'</b></td>'
                tbodyHTML += '<td></td>'
                tbodyHTML += '</tr>'
                
            }
            dataTable += tbodyHTML
            dataTable += '</tbody>'
        dataTable += '</table>'
        const result = await email_sending('christian.villamer@iteklabs.tech', dataTable, `Cronjob ${date} - ${formattedTime}`);
        console.log(`Cronjob ${date} - ${formattedTime}`)
        // console.log(dataTable)
        // console.log(`date: ${date} -  ${formattedTime}`)
        // console.log(data_val)
    } catch (error) {
        console.log(error)
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} 🚀`);
});