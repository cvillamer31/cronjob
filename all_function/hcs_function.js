const { connectToDatabase } = require('../DB/database');
const axios = require('axios');
const https = require('https');



const agent = new https.Agent({
    rejectUnauthorized: true, // Disable SSL certificate validation
});




;

function formatDate(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = date.getMilliseconds();

    // Format the result
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.00`;
}

async function send_to_HCS(json_data){

    const date_out = formatDate(json_data.date_data);
    const data_to_send = {
        "identity": {
            "code": json_data.PIN
        },
        "timeTag": {
            "code": json_data.TypeOfTag
        },
        "logDate": date_out,
        "logTime": json_data.time_data,
        "deviceIdentifier": process.env.IDENTFIER,
        "secret": process.env.SECRET
    }



    const url = process.env.HCS_URL+'/public/api/hrEmployeeTimeLog/logRemoteTime'
    // await axios.post(url, data_to_send,  { httpsAgent: agent })
    // .then(response => {
    //     // console.log('Response:', response.data);
    //     return response.data;
    // })
    // .catch(error => {
    //     // console.error('Error:', error.response ? error.response.data : error.message);
    //     return { error: error.response ? error.response.data : error.message };
    // });

    try {
        const response = await axios.post(url, data_to_send, { httpsAgent: agent });
        console.log('Response:', response.data);
        return response.data; // Return the successful response data
    } catch (error) {
        // console.error('Error:', error.response ? error.response.data : error.message);
        return { error: error.response ? error.response.data : error.message }; // Return the error
    }
}

async function getIn_today(date){
    try {
        const connection = await connectToDatabase(); 
        const [rows] = await connection.query( `
            SELECT date AS date_data, in_time AS time_data , in_location_id, users.PIN, 1 AS TypeOfTag FROM attendances 
            INNER JOIN users ON attendances.worker_id = users.id
            WHERE DATE(date) = ?
            `, [date]);
        await connection.end();  // Close the connection after query
        return rows;
    } catch (err) {
        console.error('Error fetching data:', err.message);
        throw err; // Propagate the error to the caller
    }
}


async function getOut_today(date){
    try {
        const connection = await connectToDatabase(); 
        const [rows] = await connection.query( `
            SELECT date_out AS date_data, out_time AS time_data, out_location_id, users.PIN, 2 AS TypeOfTag  FROM attendances 
            INNER JOIN users ON attendances.worker_id = users.id
            WHERE DATE(date_out) = ?
            `, [date]);
        await connection.end();  // Close the connection after query
        return rows;
    } catch (err) {
        console.error('Error fetching data:', err.message);
        throw err; // Propagate the error to the caller
    }
}



async function sendin_in_out(date) {
    
    
    try {

        const In_data = await getIn_today(date);

        for (let index = 0; index <= In_data.length - 1; index++) {
            const element = In_data[index];
            const data = await send_to_HCS(element)
            console.log("in", data)
        }
        const Out_data = await getOut_today(date);

        for (let index = 0; index <= Out_data.length - 1; index++) {
            const element = Out_data[index];
            const data = await send_to_HCS(element)
            console.log("out",data)
        }
        

        // for (let index = 0; index <= In_data.length - 1; index++) {
        //     const element = In_data[index];
        //     const date_in = formatDate(element.date);
        //     const data_to_send = {
        //         "identity": {
        //             "code": element.PIN
        //         },
        //         "timeTag": {
        //             "code": element.TypeOfTag
        //         },
        //         "logDate": date_in,
        //         "logTime": element.in_time,
        //         "deviceIdentifier": process.env.IDENTFIER,
        //         "secret": process.env.SECRET
        //     }

        //     const url = process.env.HCS_URL+'/public/api/hrEmployeeTimeLog/logRemoteTime'
            
        //     console.log(data_to_send)

        //     await axios.post(url, data_to_send,  { httpsAgent: agent })
        //     .then(response => {
        //         console.log('Response:', response.data);
        //     })
        //     .catch(error => {
        //         console.error('Error:', error.response ? error.response.data : error.message);
        //     });
            
        // }
        
        // console.log(data_to_send) 
        return { status: 200, message: "Done Running...", data_in: In_data,  data_out: Out_data  }
    } catch (error) {
        return { status: 500, message: error }
    }
}


module.exports = { formatDate, getIn_today, sendin_in_out, getOut_today  };