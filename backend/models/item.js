const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  uniqueCode: String,
  metaData: {
      newsUrl: String,
      mapUrl: String,
      latitude: String,
      longitude: String,
      locationName: String,
      category: String,
  }
});

  // Create a model based on the schema
  const Data = mongoose.model('Data', dataSchema);


module.exports = Data
