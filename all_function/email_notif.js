const nodemailer = require('nodemailer');
const { connectToDatabase } = require('../DB/database');

let mailTransporter = nodemailer.createTransport({
    host: 'mail.iteklabs.tech',
    port: Number(465),
    secure: true,
    auth: {
        user: 'christian.villamer@iteklabs.tech',
        pass: 'Ilovecrv@22'
    }
});


async function email_sending(email, message, subject){

    let mailDetails = {
        from: 'cronjob@iteklabs.tech',
        to: email,
        subject:'Transfer Mail',
        // attachments: [{
        //     filename: 'Logo.png',
        //     path: __dirname,
        //     cid: 'logo'
        // }],
        html:'<b>hello</b>'
    };


    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log(err);
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });

}


async function get_HtmlData(date){
    try {
        const connection = await connectToDatabase(); 
        const [rows] = await connection.query( `
            SELECT attendances.id AS A_id, users.name AS U_Name, users.PIN AS U_PIN, date AS date_in, in_time AS time_in, date_out FROM attendances 
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


module.exports = { email_sending };