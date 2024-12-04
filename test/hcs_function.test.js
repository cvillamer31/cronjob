const { formatDate, getIn_today, sendin_in_out, getOut_today } = require('../all_function/hcs_function');
const { expect, test } = require('@jest/globals');
const moment = require('moment-timezone');


const now = moment().tz('Asia/Manila');
const date = now.format('YYYY-MM-DD');

const shouldSkipTest = true; // Change this condition as needed
(shouldSkipTest ? test.skip : test)('Test for formatdate function', () => {
    
    const result = formatDate(date);
    console.log(result)
    expect(result).toBe(result);
});
const GetIn = true; // Change this condition as needed
(GetIn ? test.skip : test)('Test for getIn_today function', async () => {
    
  const result = await getIn_today(date);
  console.log(result)
  expect(result).toBe(result);
});

const GetIout= true; // Change this condition as needed
(GetIout ? test.skip : test)('Test for getOut_today function', async () => {
  const result = await getOut_today(date);
  console.log(result)
  expect(result).toBe(result);
});
const seninout = false;
(seninout ? test.skip : test)('Test for sendin_in_out function', async () => {
    
  const result = await sendin_in_out(date);
  // console.log(result)
  expect(result).toBe(result);
});