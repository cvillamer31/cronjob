const { expect, test } = require('@jest/globals');
const { email_sending, get_HtmlData } = require('../all_function/email_notif');

const emailtest = false;
(emailtest ? test.skip : test)('Test for email function', async () => {
    const HTML = await get_HtmlData('2024-12-06');
    //   const result = await email_sending('christian.villamer@iteklabs.tech', 'TEST');
  console.log(HTML)
  let tbodyHTML = '';
    for (let index = 0; index <= HTML.length-1; index++) {
        const element = HTML[index];
        tbodyHTML += '<tr>'
        tbodyHTML += '<td>'+element.A_id+'</td>'
        tbodyHTML += '<td>'+element.U_Name+'</td>'
        tbodyHTML += '<td>'+element.U_PIN+'</td>'
        tbodyHTML += '<td>'+element.date_in+'</td>'
        tbodyHTML += '<td>'+element.time_in+'</td>'
        tbodyHTML += '<td>'+element.out_time+'</td>'
        tbodyHTML += '</tr>'
        
    }

    console.log(tbodyHTML)
//   expect(result).toBe(result);
});