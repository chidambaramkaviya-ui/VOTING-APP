const Voter = require('./models/Voter');
const sequelize = require('./config/database');

const seedVoters = async () => {
   try {
      await sequelize.authenticate();
      console.log('✅ Connected to DB');
      await sequelize.sync();

      const newVoters = [
         // Requested specifics
         { aadharNumber: '335204204771', phoneNumber: '9000000001', hasVoted: false, isVerified: false },
         { aadharNumber: '745018278673', phoneNumber: '9000000002', hasVoted: false, isVerified: false },
         { aadharNumber: '123412341234', phoneNumber: '9000000011', hasVoted: false, isVerified: false }, // New test number
         // 8 More random valid-ish 12 digit numbers
         { aadharNumber: '111122223333', phoneNumber: '9000000003', hasVoted: false, isVerified: false },
         { aadharNumber: '444455556666', phoneNumber: '9000000004', hasVoted: false, isVerified: false },
         { aadharNumber: '777788889999', phoneNumber: '9000000005', hasVoted: false, isVerified: false },
         { aadharNumber: '121212121212', phoneNumber: '9000000006', hasVoted: false, isVerified: false },
         { aadharNumber: '343434343434', phoneNumber: '9000000007', hasVoted: false, isVerified: false },
         { aadharNumber: '565656565656', phoneNumber: '9000000008', hasVoted: false, isVerified: false },
         { aadharNumber: '787878787878', phoneNumber: '9000000009', hasVoted: false, isVerified: false },
         { aadharNumber: '909090909090', phoneNumber: '9000000010', hasVoted: false, isVerified: false },
         // 20 Extra added for testing
         { aadharNumber: '100000000001', phoneNumber: '9000000101', hasVoted: false, isVerified: false },
         { aadharNumber: '100000000002', phoneNumber: '9000000102', hasVoted: false, isVerified: false },
         { aadharNumber: '100000000003', phoneNumber: '9000000103', hasVoted: false, isVerified: false },
         { aadharNumber: '100000000004', phoneNumber: '9000000104', hasVoted: false, isVerified: false },
         { aadharNumber: '100000000005', phoneNumber: '9000000105', hasVoted: false, isVerified: false },
         { aadharNumber: '100000000006', phoneNumber: '9000000106', hasVoted: false, isVerified: false },
         { aadharNumber: '100000000007', phoneNumber: '9000000107', hasVoted: false, isVerified: false },
         { aadharNumber: '100000000008', phoneNumber: '9000000108', hasVoted: false, isVerified: false },
         { aadharNumber: '100000000009', phoneNumber: '9000000109', hasVoted: false, isVerified: false },
         { aadharNumber: '100000000010', phoneNumber: '9000000110', hasVoted: false, isVerified: false },
         { aadharNumber: '100000000011', phoneNumber: '9000000111', hasVoted: false, isVerified: false },
         { aadharNumber: '100000000012', phoneNumber: '9000000112', hasVoted: false, isVerified: false },
         { aadharNumber: '100000000013', phoneNumber: '9000000113', hasVoted: false, isVerified: false },
         { aadharNumber: '100000000014', phoneNumber: '9000000114', hasVoted: false, isVerified: false },
         { aadharNumber: '100000000015', phoneNumber: '9000000115', hasVoted: false, isVerified: false },
         { aadharNumber: '100000000016', phoneNumber: '9000000116', hasVoted: false, isVerified: false },
         { aadharNumber: '100000000017', phoneNumber: '9000000117', hasVoted: false, isVerified: false },
         { aadharNumber: '100000000018', phoneNumber: '9000000118', hasVoted: false, isVerified: false },
         { aadharNumber: '100000000019', phoneNumber: '9000000119', hasVoted: false, isVerified: false },
         { aadharNumber: '100000000020', phoneNumber: '9000000120', hasVoted: false, isVerified: false }
      ];

      for (const voter of newVoters) {
         try {
            await Voter.create(voter);
            console.log(`Created voter: ${voter.aadharNumber}`);
         } catch (error) {
            console.log(`Skipped (maybe exists): ${voter.aadharNumber}`);
         }
      }

      console.log('🎉 Seeding Complete.');
   } catch (error) {
      console.error('Seeding error:', error);
   } finally {
      process.exit();
   }
};

seedVoters();
