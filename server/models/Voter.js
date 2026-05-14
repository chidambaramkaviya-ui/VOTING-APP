const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Voter = sequelize.define('Voter', {
   aadharNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
   },
   phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
   },
   isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
   },
   hasVoted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
   },
   faceData: {
      type: DataTypes.JSON, // Stores array/object
      defaultValue: []
   },
   otp: {
      type: DataTypes.STRING,
      allowNull: true
   },
   otpExpires: {
      type: DataTypes.DATE, // or BIGINT if storing timestamp directly
      allowNull: true
   }
});

module.exports = Voter;
