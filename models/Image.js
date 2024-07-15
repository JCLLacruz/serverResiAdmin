const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const ImageSchema = new mongoose.Schema({
    data: Buffer,
    contentType: String,
    userId: { type: ObjectId, ref: 'User' },
    residentId: { type: ObjectId, ref: 'Resident' }
  });
  
  const Image = mongoose.model('Image', ImageSchema);
  module.exports = Image