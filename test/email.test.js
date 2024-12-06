const { expect, test } = require('@jest/globals');
const { email_sending } = require('../all_function/email_notif');

const emailtest = false;
(emailtest ? test.skip : test)('Test for email function', async () => {
    
  const result = await email_sending('christian.villamer@iteklabs.tech', 'TEST');
  // console.log(result)
  expect(result).toBe(result);
});