require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.TWOFACTOR_API_KEY;
const MOBILE = "8754881937"; // Test number

async function test2FactorFlow() {
   console.log(`Testing 2Factor Auto-Gen Flow to ${MOBILE}...`);

   if (!API_KEY || API_KEY.includes("YOUR_2FACTOR_API_KEY")) {
      console.error("❌ ERROR: Invalid or missing TWOFACTOR_API_KEY in .env");
      return;
   }

   // 1. Send OTP (AUTOGEN)
   const sendUrl = `https://2factor.in/API/V1/${API_KEY}/SMS/+91${MOBILE}/AUTOGEN/OTP1`;
   let sessionId = null;

   try {
      console.log("Sending OTP...");
      const sendResponse = await axios.get(sendUrl);
      console.log("Send Response:", sendResponse.data);

      if (sendResponse.data.Status === 'Success') {
         sessionId = sendResponse.data.Details;
         console.log(`✅ OTP Sent! Session ID: ${sessionId}`);
      } else {
         console.error("❌ Send Failed:", sendResponse.data);
         return;
      }
   } catch (error) {
      console.error("❌ Send Request Error:", error.message);
      return;
   }

   // 2. Verify OTP (Interactive or Mocked)
   if (sessionId) {
      console.log("\nTo verify, you would use:");
      console.log(`URL: curl --location 'https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${sessionId}/<OTP>'`);
      console.log("Since we can't read the SMS via script automatically, manually test this URL in browser with the OTP you received.");
   }
}

test2FactorFlow();
