const Voter = require('./models/Voter');
const sequelize = require('./config/database');

const seed50Voters = async () => {
   try {
      await sequelize.authenticate();
      console.log('✅ Connected to DB');

      const newVoters = [];
      for (let i = 1; i <= 50; i++) {
         const aadhar = (100000000050 + i).toString();
         const phone = (9100000000 + i).toString();
         newVoters.push({
            aadharNumber: aadhar,
            phoneNumber: phone,
            hasVoted: false,
            isVerified: false
         });
      }

      for (const voter of newVoters) {
         try {
            await Voter.create(voter);
            console.log(`Created voter: ${voter.aadharNumber}`);
         } catch (error) {
            console.log(`Skipped (already exists): ${voter.aadharNumber}`);
         }
      }

      console.log('🎉 Seeding 50 voters complete.');
   } catch (error) {
      console.error('Seeding error:', error);
   } finally {
      process.exit();
   }
};

seed50Voters();
