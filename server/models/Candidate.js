const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Candidate = sequelize.define('Candidate', {
   name: {
      type: DataTypes.STRING,
      allowNull: false
   },
   party: {
      type: DataTypes.STRING,
      allowNull: false
   },
   voteCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
   },
   candidateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
   }
});

module.exports = Candidate;
