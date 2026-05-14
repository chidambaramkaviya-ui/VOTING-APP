const express = require('express');
const router = express.Router();
const axios = require('axios'); // For 2Factor SMS
const Voter = require('../models/Voter');


// Mock Aadhar Data for Demo
const VALID_AADHARS = [
   '123456789012', // Demo User 1
   '517255690498', // Demo User 2
   '987654321098', // New Generated User
   '810600986411', // Added User
   '456123789012', // New Generated User 2
   '554433221100', // Freshly Generated User
   '112233445566', // New Added User
   '999988887777', // New Test User
   '111111111111', // Extra User 1
   '222222222222', // Extra User 2
   '333333333333', // Extra User 3
   '444444444444', // Extra User 4
   '555555555555', // Extra User 5
   // Seeded Users
   '335204204771',
   '745018278673',
   '123412341234', // Newly added test number
   '111122223333',
   '444455556666',
   '777788889999',
   '121212121212',
   '343434343434',
   '565656565656',
   '787878787878',
   '909090909090',
   // 20 Extra added for testing
   '100000000001',
   '100000000002',
   '100000000003',
   '100000000004',
   '100000000005',
   '100000000006',
   '100000000007',
   '100000000008',
   '100000000009',
   '100000000010',
   '100000000011',
   '100000000012',
   '100000000013',
   '100000000014',
   '100000000015',
   '100000000016',
   '100000000017',
   '100000000018',
   '100000000019',
   '100000000020',
   // 50 New Test Aadhars (100000000051 - 100000000100)
   ...Array.from({ length: 50 }, (_, i) => (100000000051 + i).toString())
];

// @route   POST /api/voters/verify-aadhar
// @desc    Verify if Aadhar is valid and not voted
router.post('/verify-aadhar', async (req, res) => {
   const { aadharNumber } = req.body;

   if (!aadharNumber || aadharNumber.length !== 12) {
      return res.status(400).json({ success: false, message: 'Invalid Aadhar Number format' });
   }

   // 1. Check if Aadhar is in valid registry (Mock List)
   const staticValid = VALID_AADHARS.includes(aadharNumber);

   try {
      // 2. Check DB status
      let voter = await Voter.findOne({ where: { aadharNumber } });

      // If not in static list AND not in DB, it's truly unknown
      if (!staticValid && !voter) {
         return res.status(404).json({ success: false, message: 'Aadhar not found in Registry' });
      }

      if (voter && voter.hasVoted) {
         return res.status(403).json({ success: false, message: 'Already Voted! Login Denied.' });
      }

      // 3. If valid but not in DB, create record for tracking
      if (!voter) {
         voter = await Voter.create({
            aadharNumber,
            phoneNumber: '8754881937', // Using default/mock phone for now as per demo
            isVerified: true,
            hasVoted: false
         });
      }

      return res.json({ success: true, message: 'Aadhar Verified', phone: '8754881937' });

   } catch (error) {
      console.error('Database Error:', error);
      return res.status(500).json({ success: false, message: 'Server Error' });
   }
});

// @route   POST /api/voters/cast-vote
// @desc    Mark Aadhar as voted
router.post('/cast-vote', async (req, res) => {
   const { aadharNumber } = req.body;
   try {
      const voter = await Voter.findOne({ where: { aadharNumber } });
      if (voter) {
         voter.hasVoted = true;
         await voter.save();
         return res.json({ success: true, message: 'Vote Recorded' });
      }
      return res.status(404).json({ success: false, message: 'Voter not found' });
   } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to record vote' });
   }
});

// In-memory OTP store for demo (Use Redis in production)
const otpStore = new Map();

// @route   POST /api/voters/send-otp
router.post('/send-otp', async (req, res) => {
   const { phone, mobile } = req.body;
   const targetPhone = phone || mobile;

   if (!targetPhone) {
      return res.status(400).json({ success: false, message: 'Phone/Mobile number required' });
   }

   // Integration with 2Factor SMS
   try {
      console.log(`[ATTEMPT] Sending real OTP via 2Factor to phone: ${targetPhone}`);

      const url = `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/+91${targetPhone}/AUTOGEN/OTP1`;

      const response = await axios.get(url);
      console.log(`[API RESPONSE] Status: ${response.data.Status}, Details: ${response.data.Details}`);

      if (response.data.Status !== "Success") {
         console.error(`[API ERROR] 2Factor Failed:`, response.data);
         return res.status(400).json({
            success: false,
            message: "OTP send failed"
         });
      }

      // Store sessionId mapped to phone for verification
      const sessionId = response.data.Details;
      otpStore.set(targetPhone, { sessionId: sessionId, expires: Date.now() + 300000 });
      console.log(`[OTP SENT] SessionId: ${sessionId} for ${targetPhone}`);

      res.json({
         success: true,
         message: "OTP sent successfully",
         sessionId: sessionId // Optional: send to frontend if needed
      });

   } catch (err) {
      console.error("[CATCH ERROR] 2Factor Exception:", err.response ? err.response.data : err.message);
      return res.status(500).json({
         success: false,
         message: "2Factor OTP service error"
      });
   }
});

// @route   POST /api/voters/verify-otp
router.post('/verify-otp', async (req, res) => {
   const { phone, otp } = req.body;


   const record = otpStore.get(phone);

   if (!record || !record.sessionId) {
      return res.status(400).json({ success: false, message: 'OTP expired or not sent' });
   }

   if (Date.now() > record.expires) {
      otpStore.delete(phone);
      return res.status(400).json({ success: false, message: 'OTP expired' });
   }

   try {
      const url = `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/VERIFY/${record.sessionId}/${otp}`;

      const response = await axios.get(url);

      if (response.data.Status === "Success") {
         otpStore.delete(phone); // Clear after usage
         return res.json({
            success: true,
            message: "OTP verified successfully"
         });
      }

      return res.status(400).json({
         success: false,
         message: "Invalid OTP"
      });

   } catch (err) {
      console.error("Verify Error:", err.message);
      res.status(500).json({
         success: false,
         message: "OTP verification failed"
      });
   }
});

module.exports = router;
